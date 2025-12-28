#Requires AutoHotkey v1.1
#SingleInstance, Force
#Persistent
SendMode, Event
SetTitleMatchMode, 2
SetWorkingDir, %A_ScriptDir%
CoordMode, Pixel, Screen
CoordMode, Mouse, Screen

; =====================================
; 設定値（ここだけ調整すればOK）
; =====================================

global IntervalMs := 300
global MinSendIntervalMs := 250
global TargetExePattern := "^(Windsurf\.exe|Code\.exe|Cursor\.exe)$"
global RequiredTitleKeywords := "Windsurf"
global EnableOrangeDetection := false
global OrangeColor := 0xF0883E
global OrangeColorTolerance := 25
global SendSequence := "!{Enter}"
global SendMode := 0                 ; 0 = Always send, 1 = Only when command visible
global CommandVisibleTimeoutMs := 4000
global EnableUserGuard := true        ; ユーザー操作中は送信しない
global UserIdleThresholdMs := 500    ; ユーザーアイドル時間の閾値

; =====================================
; 状態変数
; =====================================

global AutoEnabled := false
global LastSendTime := 0
global CurrentExe := ""
global LastCommandVisibleTick := 0
global LastGuiUpdateTick := 0
global GuiUpdateIntervalMs := 500
global InstructionFile := A_ScriptDir "\..\..\docs\inbox\next_instruction.txt"
global LastInstructionTime := ""
global PreserveClipboard := true

; =====================================
; 管理者実行
; =====================================

if not A_IsAdmin
{
    Run *RunAs "%A_ScriptFullPath%"
    ExitApp
}

; =====================================
; 設定ファイル読み込み
; =====================================

ConfigFile := A_ScriptDir "\windsurf_autopilot.ini"
global EnableFileWatch := true
LoadConfig()

; =====================================
; GUI 作成（WindowSlu 風ダークテーマ）
; =====================================

sendModeIndex := SendMode + 1
LogFile := A_ScriptDir "\windsurf_autopilot_debug.log"

Gui, -MaximizeBox +MinimizeBox +AlwaysOnTop +ToolWindow
Gui, Color, 0x1E1E1E
Gui, Font, cWhite s10 Bold, Segoe UI

; 行1: ステータスとトグルボタン
Gui, Add, Text, vStatusText Center w240, AUTO OFF
Gui, Add, Button, gGuiToggle xp+0 yp+24 w240 Background0x333333 cWhite, Toggle (F8)

; 行2: パラメータ編集
Gui, Font, cWhite s9, Segoe UI
Gui, Add, Text, xm y+12, Interval (ms):
Gui, Add, Edit, vIntervalEdit w80 Number, %IntervalMs%
Gui, Add, Text, x+10 yp, MinSend (ms):
Gui, Add, Edit, vMinSendEdit w80 Number, %MinSendIntervalMs%

Gui, Add, Text, xm y+8, Target Exe (regex):
Gui, Add, Edit, vTargetExeEdit w260, %TargetExePattern%

Gui, Add, Text, xm y+8, Title Keywords (empty=disabled):
Gui, Add, Edit, vTitleKeywordsEdit w260, %RequiredTitleKeywords%

Gui, Add, Text, xm y+8, Send Mode:
Gui, Add, DropDownList, vSendModeDDL w260 Choose%sendModeIndex%, Always (interval-based)|Only when command visible (orange)

Gui, Add, Text, xm y+8, Send Keys (AHK syntax):
Gui, Add, Edit, vSendKeysEdit w260, %SendSequence%

Gui, Add, Button, gApplySettings xm y+8 w90 Background0x333333 cWhite, Apply

; 行3: 情報表示
Gui, Font, cGray s8, Consolas
Gui, Add, Text, vInfoText xm y+8 w260, 

Gui, Margin, 10, 8
HudX := A_ScreenWidth - 300
HudY := 40
Gui, Show, x%HudX% y%HudY% AutoSize, Windsurf Autopilot

UpdateGui()

; =====================================
; タイマー開始
; =====================================

SetTimer, TimerMainLoop, %IntervalMs%
SetTimer, TimerFileWatch, 1000

; =====================================
; ホットキー / ラベル
; =====================================

; F8: ON/OFF トグル
F8::
    ToggleAuto()
    return

; F9: 強制OFF
F9::
    SetAuto(false)
    return

; Shift+Esc: 終了
+Esc::
    ExitApp

; F10: ファイル監視トグル
F10::
    global EnableFileWatch
    EnableFileWatch := !EnableFileWatch
    LogEvent("TOGGLE", "FileWatch=" (EnableFileWatch ? "ON" : "OFF"))
    return

; GUI ボタン
GuiToggle:
    ToggleAuto()
    return

; 設定適用ボタン
ApplySettings:
    Gui, Submit, NoHide
    global IntervalMs, MinSendIntervalMs, TargetExePattern, RequiredTitleKeywords
    global SendMode, SendSequence, ConfigFile, EnableFileWatch
    
    if (IntervalEdit >= 50)
        IntervalMs := IntervalEdit
    if (MinSendEdit >= 50)
        MinSendIntervalMs := MinSendEdit
    if (TargetExeEdit != "")
        TargetExePattern := TargetExeEdit
    if (TitleKeywordsEdit != "")
        RequiredTitleKeywords := TitleKeywordsEdit

    if (SendKeysEdit != "")
        SendSequence := SendKeysEdit

    if (SendModeDDL != "")
    {
        if (InStr(SendModeDDL, "Only when"))
            SendMode := 1
        else
            SendMode := 0
    }
    
    SaveConfig()
    SetTimer, TimerMainLoop, %IntervalMs%
    UpdateGui()
    return

; メインループタイマー
TimerMainLoop:
    MainLoop()
    return

; ファイル監視タイマー
TimerFileWatch:
    if (!AutoEnabled || !EnableFileWatch)
        return
    if !EnsureTargetActive()
        return
    
    if !FileExist(InstructionFile)
        return
    
    FileGetTime, t, %InstructionFile%, M
    if (t = "")
        return
    
    if (t = LastInstructionTime)
        return
    
    LastInstructionTime := t
    
    FileRead, content, %InstructionFile%
    if (content = "")
        return
    
    if (PreserveClipboard)
        clipSaved := ClipboardAll
    
    Clipboard := content
    ClipWait, 1
    
    Send, ^v
    Sleep, 40
    Send, !{Enter}
    
    Sleep, 80
    
    if (PreserveClipboard)
        Clipboard := clipSaved
    
    FileDelete, %InstructionFile%
    LogEvent("FILE_WATCH", "Instruction sent, file deleted")
    return

; ウィンドウを閉じたら終了
GuiClose:
    ExitApp

return

; =====================================
; 関数定義
; =====================================

ToggleAuto()
{
    global AutoEnabled
    AutoEnabled := !AutoEnabled
    UpdateGui()
}

SetAuto(state)
{
    global AutoEnabled
    AutoEnabled := state
    UpdateGui()
}

UpdateGui()
{
    global AutoEnabled, IntervalMs, MinSendIntervalMs, TargetExePattern, CurrentExe, LastSendTime
    global SendMode, SendSequence, LastGuiUpdateTick, GuiUpdateIntervalMs

    now := A_TickCount
    if (now - LastGuiUpdateTick < GuiUpdateIntervalMs)
        return
    LastGuiUpdateTick := now

    status := AutoEnabled ? "AUTO ON" : "AUTO OFF"
    color  := AutoEnabled ? "0x0078D4" : "0x2D2D30"

    GuiControl,, StatusText, %status%
    Gui, Color, %color%

    elapsed := (LastSendTime = 0) ? "N/A" : (A_TickCount - LastSendTime) " ms"
    modeLabel := (SendMode = 0) ? "Always" : "CmdOnly"
    info := "Mode:" modeLabel "  Keys:" SendSequence "  Interval:" IntervalMs "  MinSend:" MinSendIntervalMs "  Exe:" (CurrentExe = "" ? "-" : CurrentExe) "  LastSend:" elapsed
    GuiControl,, InfoText, %info%
}


MainLoop()
{
    global AutoEnabled, MinSendIntervalMs, LastSendTime, EnableOrangeDetection
    global SendMode, LastCommandVisibleTick, CommandVisibleTimeoutMs
    global SendSequence, EnableUserGuard, UserIdleThresholdMs
    global OrangeColor, OrangeColorTolerance

    if (!AutoEnabled)
        return

    if !EnsureTargetActive()
        return

    if (EnableUserGuard && !IsSafeToSend())
        return

    now := A_TickCount
    if (now - LastSendTime < MinSendIntervalMs)
        return

    orangeFound := false
    if (SendMode = 1 || EnableOrangeDetection)
    {
        if (FindOrangeInWindow(orangeX, orangeY))
        {
            orangeFound := true
            LastCommandVisibleTick := now
        }
    }

    if (SendMode = 1)
    {
        if (!orangeFound)
        {
            if (!LastCommandVisibleTick)
                return
            if (now - LastCommandVisibleTick > CommandVisibleTimeoutMs)
                return
        }
    }
    else if (EnableOrangeDetection)
    {
        if (!orangeFound)
            return
    }

    Send, %SendSequence%
    LastSendTime := now
    LogEvent("SEND", "Mode=" (SendMode = 0 ? "Always" : "CmdOnly") " Keys=" SendSequence " Exe=" CurrentExe)
}

FindOrangeInWindow(ByRef orangeX, ByRef orangeY)
{
    global OrangeColor, OrangeColorTolerance

    WinGetPos, wx, wy, ww, wh, A

    if (ww = 0 || wh = 0)
        return false

    ; 検索範囲（ウィンドウの 20-100%）
    searchX := wx + (ww * 0.2)
    searchY := wy + (wh * 0.2)
    searchW := ww * 0.8
    searchH := wh * 0.8

    if (searchW < 400)
        searchW := 400
    if (searchH < 300)
        searchH := 300

    PixelSearch, foundX, foundY, searchX, searchY, searchX + searchW, searchY + searchH, OrangeColor, OrangeColorTolerance, RGB

    if (!ErrorLevel)
    {
        orangeX := foundX
        orangeY := foundY
        return true
    }

    return false
}

AutoStop() {
    global AutoEnabled
    AutoEnabled := false
    UpdateGui()
}

AutoReset() {
    global AutoEnabled
    AutoEnabled := false
    UpdateGui()
}

LoadConfig()
{
    global IntervalMs, MinSendIntervalMs, TargetExePattern, RequiredTitleKeywords
    global SendMode, SendSequence, ConfigFile
    
    if !FileExist(ConfigFile)
        return
    
    IniRead, val, %ConfigFile%, Settings, IntervalMs
    if (val != "ERROR" && val >= 50)
        IntervalMs := val
    
    IniRead, val, %ConfigFile%, Settings, MinSendIntervalMs
    if (val != "ERROR" && val >= 50)
        MinSendIntervalMs := val
    
    IniRead, val, %ConfigFile%, Settings, TargetExePattern
    if (val != "ERROR" && val != "")
        TargetExePattern := val
    
    IniRead, val, %ConfigFile%, Settings, RequiredTitleKeywords
    if (val != "ERROR")
        RequiredTitleKeywords := val
    
    IniRead, val, %ConfigFile%, Settings, SendMode
    if (val != "ERROR" && (val = 0 || val = 1))
        SendMode := val
    
    IniRead, val, %ConfigFile%, Settings, SendSequence
    if (val != "ERROR" && val != "")
        SendSequence := val
}

SaveConfig()
{
    global IntervalMs, MinSendIntervalMs, TargetExePattern, RequiredTitleKeywords
    global SendMode, SendSequence, ConfigFile
    
    IniWrite, %IntervalMs%, %ConfigFile%, Settings, IntervalMs
    IniWrite, %MinSendIntervalMs%, %ConfigFile%, Settings, MinSendIntervalMs
    IniWrite, %TargetExePattern%, %ConfigFile%, Settings, TargetExePattern
    IniWrite, %RequiredTitleKeywords%, %ConfigFile%, Settings, RequiredTitleKeywords
    IniWrite, %SendMode%, %ConfigFile%, Settings, SendMode
    IniWrite, %SendSequence%, %ConfigFile%, Settings, SendSequence
}

LogEvent(eventType, details)
{
    global LogFile
    timestamp := A_Now
    line := timestamp " [" eventType "] " details "`n"
    FileAppend, %line%, %LogFile%
}

IsSafeToSend()
{
    global UserIdleThresholdMs

    if (A_TimeIdlePhysical < UserIdleThresholdMs)
        return false

    if (GetKeyState("LButton", "P") || GetKeyState("RButton", "P") || GetKeyState("MButton", "P"))
        return false

    if (GetKeyState("Shift", "P") || GetKeyState("Ctrl", "P") || GetKeyState("Alt", "P"))
        return false

    return true
}

EnsureTargetActive()
{
    global TargetExePattern, RequiredTitleKeywords, CurrentExe

    WinGet, id, ID, A
    if (id != "")
    {
        WinGet, exe, ProcessName, ahk_id %id%
        WinGetTitle, title, ahk_id %id%
        CurrentExe := exe
        
        if (RegExMatch(exe, TargetExePattern))
        {
            if (RequiredTitleKeywords = "")
                return true
            if (InStr(title, RequiredTitleKeywords))
                return true
        }
    }

    if WinExist("ahk_exe Windsurf.exe")
    {
        CurrentExe := "Windsurf.exe"
        WinActivate
        return true
    }
    if WinExist("ahk_exe Code.exe")
    {
        CurrentExe := "Code.exe"
        WinActivate
        return true
    }
    if WinExist("ahk_exe Cursor.exe")
    {
        CurrentExe := "Cursor.exe"
        WinActivate
        return true
    }

    CurrentExe := ""
    return false
}
