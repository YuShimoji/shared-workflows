#Requires AutoHotkey v1.1
#SingleInstance, Force
#Persistent
SendMode, Event
SetTitleMatchMode, 2
SetWorkingDir, %A_ScriptDir%
CoordMode, Pixel, Screen
CoordMode, Mouse, Screen

#Include CtlColors.ahk

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
global LastUserActivityTick := 0
global UserCooldownMs := 1500        ; ユーザー操作後の待機時間
global LastMouseX := 0
global LastMouseY := 0
global PatrolIntervalSec := 5
global PatrolIntervalMs  := 5000
global CleanupIntervalSec := 5
global CleanupIntervalMs  := 5000
global LastPatrolTick := 0
global LastCleanupTick := 0
global EnablePatrol := false
global AutoCloseGitTabs := true

; GUIカラー定義 ("RRGGBB" 形式)
global clGui    := "121212"  ; 背景 (深い黒)
global clBox    := "1E1E1E"  ; ボックス背景 (暗い灰色)
global clBtn    := "2D2D30"  ; ボタン背景
global clText   := "808080"  ; ラベル文字 (灰色)
global clVal    := "FFFFFF"  ; 入力値/強調文字 (純白)
global clActive := "005A9E"  ; AUTO ON時のアクセント色
global clOrange := "F0883E"  ; AIパネル検出色
global clDanger := "D13438"  ; 警告/中断色
global clWhite  := "FFFFFF"  ; 白色

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
LoadConfig()

; =====================================
; GUI 作成（WindowSlu 風ダークテーマ）
; =====================================

sendModeIndex := SendMode + 1
LogFile := A_ScriptDir "\windsurf_autopilot_debug.log"

; 起動時のマウス座標を初期化（初回判定の誤作動防止）
MouseGetPos, LastMouseX, LastMouseY
LastUserActivityTick := A_TickCount

Gui, +HwndMyGuiHwnd -MaximizeBox +MinimizeBox +AlwaysOnTop +ToolWindow
Gui, Color, %clGui%
Gui, Font, c%clText% s10 Bold, Segoe UI

; 行1: ステータス
Gui, Add, Text, vStatusText Center w240 +HwndhStatusText, AUTO OFF

; ボタン（背景Progress + ラベルText）
Gui, Add, Progress, x10 y+8 w240 h30 Background%clBtn% -Theme vProgToggle +HwndhProgToggle, 0
Gui, Add, Text, xp yp wp hp Center BackgroundTrans vBtnToggle +HwndhBtnToggle gGuiToggle +0x200 c%clWhite%, Toggle (F8)

; --- 行2: パラメータ編集 ---
Gui, Font, c%clText% s9 Normal, Segoe UI

Gui, Add, Text, xm y+12 +HwndhLab1, Interval (ms):
Gui, Add, Edit, vIntervalEdit w80 Number -E0x200 Background%clBox% c%clVal%, %IntervalMs%
Gui, Add, Text, x+10 yp +HwndhLab2, MinSend (ms):
Gui, Add, Edit, vMinSendEdit w80 Number -E0x200 Background%clBox% c%clVal%, %MinSendIntervalMs%

Gui, Add, Text, xm y+8 +HwndhLab3, Target Exe (regex):
Gui, Add, Edit, vTargetExeEdit w260 -E0x200 Background%clBox% c%clVal%, %TargetExePattern%

Gui, Add, Text, xm y+8 +HwndhLab4, Title Keywords (empty=disabled):
Gui, Add, Edit, vTitleKeywordsEdit w260 -E0x200 Background%clBox% c%clVal%, %RequiredTitleKeywords%

Gui, Add, Text, xm y+8 +HwndhLab5, Send Mode:
Gui, Add, DropDownList, vSendModeDDL w260 Choose%sendModeIndex% -Theme -E0x200 Background%clBox% c%clVal% +HwndhSendModeDDL, Always (interval-based)|Only when command visible (orange)

Gui, Add, Text, xm y+8 +HwndhLab6, Send Keys (AHK syntax):
Gui, Add, Edit, vSendKeysEdit w260 -E0x200 Background%clBox% c%clVal%, %SendSequence%

Gui, Add, Text, xm y+8 +HwndhLab7, Patrol:
Gui, Add, DropDownList, vPatrolDDL w260 Choose1 -Theme -E0x200 Background%clBox% c%clVal% +HwndhPatrolDDL, Off|On (Cycle Windsurf Windows)

Gui, Add, Text, xm y+8 +HwndhLab8 vPatrolIntervalLabel, Patrol Interval: %PatrolIntervalSec%s
Gui, Add, Slider, xm y+2 w260 vPatrolIntervalSlider Range1-30 ToolTip gOnPatrolSliderChange +HwndhPatrolSlider -Theme, %PatrolIntervalSec%

Gui, Add, Text, xm y+8 +HwndhLab9 vCleanupIntervalLabel, Cleanup Interval: %CleanupIntervalSec%s
Gui, Add, Slider, xm y+2 w260 vCleanupIntervalSlider Range1-30 ToolTip gOnCleanupSliderChange +HwndhCleanupSlider -Theme, %CleanupIntervalSec%

; Applyボタン（背景Progress + ラベルText）
Gui, Add, Progress, xm y+8 w90 h26 Background%clBtn% -Theme vProgApply +HwndhProgApply, 0
Gui, Add, Text, xp yp wp hp Center BackgroundTrans vBtnApply +HwndhBtnApply gApplySettings +0x200 c%clWhite%, Apply

; 行3: 情報表示
Gui, Font, c666666 s8, Consolas
Gui, Add, Text, vInfoText xm y+8 w260 +HwndhInfoText, 

Gui, Margin, 10, 8
HudX := A_ScreenWidth - 300
HudY := 40
Gui, Show, x%HudX% y%HudY% AutoSize, Windsurf Autopilot

; タイトルバーをダークモード化 (Windows 10 build 18985以降は20、それ以前は19)
DllCall("dwmapi\DwmSetWindowAttribute", "Ptr", MyGuiHwnd, "Int", 19, "Int*", 1, "Int", 4)
DllCall("dwmapi\DwmSetWindowAttribute", "Ptr", MyGuiHwnd, "Int", 20, "Int*", 1, "Int", 4)

; =====================================
; ハンドルの取得と色の適用 (CtlColorsによる補完)
; =====================================

GuiControlGet, hIntervalEdit, Hwnd, IntervalEdit
GuiControlGet, hMinSendEdit, Hwnd, MinSendEdit
GuiControlGet, hTargetExeEdit, Hwnd, TargetExeEdit
GuiControlGet, hTitleKeywordsEdit, Hwnd, TitleKeywordsEdit
GuiControlGet, hSendKeysEdit, Hwnd, SendKeysEdit

GuiControlGet, hPatrolDDL, Hwnd, PatrolDDL

; スライダーのハンドル取得
GuiControlGet, hPatrolSlider, Hwnd, PatrolIntervalSlider
GuiControlGet, hCleanupSlider, Hwnd, CleanupIntervalSlider

; ボックス類
CtlColors_Attach(hIntervalEdit, clBox, clVal)
CtlColors_Attach(hMinSendEdit, clBox, clVal)
CtlColors_Attach(hTargetExeEdit, clBox, clVal)
CtlColors_Attach(hTitleKeywordsEdit, clBox, clVal)
CtlColors_Attach(hSendKeysEdit, clBox, clVal)
CtlColors_Attach(hSendModeDDL, clBox, clVal)
CtlColors_Attach(hPatrolDDL, clBox, clVal)

; スライダーも可能な限り着色
CtlColors_Attach(hPatrolSlider, clGui, clText)
CtlColors_Attach(hCleanupSlider, clGui, clText)

; ラベル・ステータス
CtlColors_Attach(hStatusText, clGui, clWhite)
CtlColors_Attach(hLab1, clGui, clText)
CtlColors_Attach(hLab2, clGui, clText)
CtlColors_Attach(hLab3, clGui, clText)
CtlColors_Attach(hLab4, clGui, clText)
CtlColors_Attach(hLab5, clGui, clText)
CtlColors_Attach(hLab6, clGui, clText)
CtlColors_Attach(hLab7, clGui, clText)
CtlColors_Attach(hLab8, clGui, clText)
CtlColors_Attach(hLab9, clGui, clText)
CtlColors_Attach(hInfoText, clGui, "666666")

; 擬似ボタンのテキスト部分
CtlColors_Attach(hBtnToggle, clBtn, clWhite)
CtlColors_Attach(hBtnApply, clBtn, clWhite)

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
    global SendMode, SendSequence, ConfigFile, EnableFileWatch, EnablePatrol
    global PatrolIntervalSec, PatrolIntervalMs, CleanupIntervalSec, CleanupIntervalMs
    
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
        SendMode := InStr(SendModeDDL, "Only when") ? 1 : 0
    
    if (PatrolDDL != "")
        EnablePatrol := InStr(PatrolDDL, "On") ? true : false
    
    ; スライダー値を即座に反映
    PatrolIntervalSec := PatrolIntervalSlider
    PatrolIntervalMs := PatrolIntervalSec * 1000

    CleanupIntervalSec := CleanupIntervalSlider
    CleanupIntervalMs := CleanupIntervalSec * 1000
    
    SaveConfig()
    SetTimer, TimerMainLoop, %IntervalMs%
    UpdateGui()
    return

OnPatrolSliderChange:
    Gui, Submit, NoHide
    PatrolIntervalSec := PatrolIntervalSlider
    PatrolIntervalMs := PatrolIntervalSec * 1000
    GuiControl,, PatrolIntervalLabel, Patrol Interval: %PatrolIntervalSec%s
    return

OnCleanupSliderChange:
    Gui, Submit, NoHide
    CleanupIntervalSec := CleanupIntervalSlider
    CleanupIntervalMs := CleanupIntervalSec * 1000
    GuiControl,, CleanupIntervalLabel, Cleanup Interval: %CleanupIntervalSec%s
    return

; メインループタイマー
TimerMainLoop:
    if (!AutoEnabled)
        return

    isSafe := IsSafeToSend()
    if (isSafe)
    {
        if (EnablePatrol)
            PatrolAndSwitch()
        if (AutoCloseGitTabs)
            CloseUnwantedTabs()
        MainLoop(true) ; すでに安全確認済みであることを伝える
    }
    else
    {
        MainLoop(false)
    }
    return

; ファイル監視タイマー
TimerFileWatch:
    if (!AutoEnabled || !EnableFileWatch)
        return
    if !EnsureTargetActive()
    {
        LogEvent("DEBUG_WATCH", "Target Not Active for FileWatch")
        return
    }
    
    if !FileExist(InstructionFile)
        return
    
    LogEvent("DEBUG_WATCH", "Instruction File Found")
    
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
    LogEvent("STATE", "AutoEnabled=" (AutoEnabled ? "ON" : "OFF"))
    UpdateGui()
}

SetAuto(state)
{
    global AutoEnabled
    AutoEnabled := state
    LogEvent("STATE", "AutoEnabled=" (state ? "ON" : "OFF"))
    UpdateGui()
}

UpdateGui()
{
    global AutoEnabled, IntervalMs, MinSendIntervalMs, TargetExePattern, CurrentExe, LastSendTime
    global SendMode, SendSequence, LastGuiUpdateTick, GuiUpdateIntervalMs, EnablePatrol
    global clGui, clActive, clText, clBtn, clWhite
    global hStatusText, hLab1, hLab2, hLab3, hLab4, hLab5, hLab6, hLab7, hLab8, hLab9, hInfoText, hBtnToggle, hProgToggle
    static lastState := -1

    now := A_TickCount
    if (now - LastGuiUpdateTick < GuiUpdateIntervalMs)
        return
    LastGuiUpdateTick := now

    if (AutoEnabled != lastState) {
        currBg := AutoEnabled ? clActive : clGui
        Gui, Color, %currBg%
        
        ; 状態に合わせてラベルの色を再適用
        CtlColors_Attach(hStatusText, currBg, clWhite)
        CtlColors_Attach(hLab1, currBg, clText)
        CtlColors_Attach(hLab2, currBg, clText)
        CtlColors_Attach(hLab3, currBg, clText)
        CtlColors_Attach(hLab4, currBg, clText)
        CtlColors_Attach(hLab5, currBg, clText)
        CtlColors_Attach(hLab6, currBg, clText)
        CtlColors_Attach(hLab7, currBg, clText)
        CtlColors_Attach(hLab8, currBg, clText)
        CtlColors_Attach(hLab9, currBg, clText)
        CtlColors_Attach(hInfoText, currBg, "666666")
        
        ; ボタンの状態更新
        btnBg := AutoEnabled ? "0078D4" : clBtn
        GuiControl, +Background%btnBg%, ProgToggle
        status := AutoEnabled ? "AUTO ON" : "AUTO OFF"
        GuiControl,, BtnToggle, %status%
        
        ; 強制的に再描画
        Gui, +LastFound
        WinSet, Redraw
        
        lastState := AutoEnabled
    }

    elapsed := (LastSendTime = 0) ? "N/A" : (A_TickCount - LastSendTime) " ms"
    modeLabel := (SendMode = 0) ? "Always" : "CmdOnly"
    patrolStatus := EnablePatrol ? " [Patrol:ON]" : ""
    info := "Mode:" modeLabel patrolStatus "  Keys:" SendSequence "  Interval:" IntervalMs "  MinSend:" MinSendIntervalMs "  Exe:" (CurrentExe = "" ? "-" : CurrentExe) "  LastSend:" elapsed
    GuiControl,, InfoText, %info%
}

MainLoop(isAlreadySafe := false)
{
    global AutoEnabled, MinSendIntervalMs, LastSendTime, EnableOrangeDetection
    global SendMode, LastCommandVisibleTick, CommandVisibleTimeoutMs
    global SendSequence, EnableUserGuard, CurrentExe

    if (!AutoEnabled)
        return

    if !EnsureTargetActive()
    {
        LogEvent("DEBUG_MAIN", "Target Not Active: " (CurrentExe = "" ? "None Found" : CurrentExe))
        return
    }

    ; --- コントロール乗っ取り防止 ---
    if (!isAlreadySafe && !IsSafeToSend())
    {
        return
    }

    now := A_TickCount
    elapsedSinceLast := now - LastSendTime
    if (elapsedSinceLast < MinSendIntervalMs)
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

    ; 送信直前の最終セーフティ
    safe := IsSafeToSend()
    if (!safe)
    {
        LogEvent("DEBUG_SEND", "Blocked by Final Safety Check")
        return
    }

    Send, %SendSequence%
    LastSendTime := now
    LogEvent("SEND", "Interval=" elapsedSinceLast "ms Mode=" (SendMode = 0 ? "Always" : "CmdOnly") " Keys=" SendSequence " Exe=" CurrentExe)
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
    global SendMode, SendSequence, ConfigFile, EnablePatrol, AutoCloseGitTabs
    global PatrolIntervalSec, PatrolIntervalMs, CleanupIntervalSec, CleanupIntervalMs
    
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

    IniRead, val, %ConfigFile%, Settings, EnablePatrol
    if (val != "ERROR")
        EnablePatrol := (val = "1" || val = "true") ? true : false

    IniRead, val, %ConfigFile%, Settings, PatrolIntervalSec
    if (val != "ERROR" && val >= 1)
    {
        PatrolIntervalSec := val
        PatrolIntervalMs := PatrolIntervalSec * 1000
    }

    IniRead, val, %ConfigFile%, Settings, CleanupIntervalSec
    if (val != "ERROR" && val >= 1)
    {
        CleanupIntervalSec := val
        CleanupIntervalMs := CleanupIntervalSec * 1000
    }

    IniRead, val, %ConfigFile%, Settings, AutoCloseGitTabs
    if (val != "ERROR")
        AutoCloseGitTabs := (val = "1" || val = "true") ? true : false
}

SaveConfig()
{
    global IntervalMs, MinSendIntervalMs, TargetExePattern, RequiredTitleKeywords
    global SendMode, SendSequence, ConfigFile, EnablePatrol, AutoCloseGitTabs
    global PatrolIntervalSec, CleanupIntervalSec
    
    IniWrite, %IntervalMs%, %ConfigFile%, Settings, IntervalMs
    IniWrite, %MinSendIntervalMs%, %ConfigFile%, Settings, MinSendIntervalMs
    IniWrite, %TargetExePattern%, %ConfigFile%, Settings, TargetExePattern
    IniWrite, %RequiredTitleKeywords%, %ConfigFile%, Settings, RequiredTitleKeywords
    IniWrite, %SendMode%, %ConfigFile%, Settings, SendMode
    IniWrite, %SendSequence%, %ConfigFile%, Settings, SendSequence
    IniWrite, % (EnablePatrol ? 1 : 0), %ConfigFile%, Settings, EnablePatrol
    IniWrite, %PatrolIntervalSec%, %ConfigFile%, Settings, PatrolIntervalSec
    IniWrite, %CleanupIntervalSec%, %ConfigFile%, Settings, CleanupIntervalSec
    IniWrite, % (AutoCloseGitTabs ? 1 : 0), %ConfigFile%, Settings, AutoCloseGitTabs
}

LogEvent(eventType, details)
{
    global LogFile
    timestamp := A_Now
    line := timestamp " [" eventType "] " details "`n"
    FileAppend, %line%, %LogFile%
}

PatrolAndSwitch()
{
    global LastPatrolTick, PatrolIntervalMs, RequiredTitleKeywords

    now := A_TickCount
    if (now - LastPatrolTick < PatrolIntervalMs)
        return
    LastPatrolTick := now

    if (!IsSafeToSend())
        return

    ; Windsurfの別ウィンドウを探してアクティブにする
    WinGet, idList, List, ahk_exe Windsurf.exe
    if (idList < 2)
        return

    WinGet, currentID, ID, A
    
    Loop, %idList%
    {
        thisID := idList%A_Index%
        if (thisID = currentID)
            continue
            
        WinGetTitle, title, ahk_id %thisID%
        if (RequiredTitleKeywords != "" && !InStr(title, RequiredTitleKeywords))
            continue
            
        WinActivate, ahk_id %thisID%
        LogEvent("PATROL", "Switched to window: " title)
        break
    }
}

CloseUnwantedTabs()
{
    global LastCleanupTick, CleanupIntervalMs
    now := A_TickCount
    if (now - LastCleanupTick < CleanupIntervalMs)
        return
    LastCleanupTick := now

    if (!IsSafeToSend())
        return

    unwanted := "COMMIT_EDITMSG|MERGE_MSG|SQUASH_MSG"
    WinGet, idList, List, ahk_exe Windsurf.exe
    Loop, %idList%
    {
        thisID := idList%A_Index%
        WinGetTitle, title, ahk_id %thisID%
        if (RegExMatch(title, unwanted))
        {
            WinActivate, ahk_id %thisID%
            Sleep, 100
            Send, ^w
            LogEvent("CLEANUP", "Closed unwanted tab: " title)
        }
    }
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
        Sleep, 50 ; アクティブ化の安定待ち
        return true
    }
    if WinExist("ahk_exe Code.exe")
    {
        CurrentExe := "Code.exe"
        WinActivate
        Sleep, 50
        return true
    }
    if WinExist("ahk_exe Cursor.exe")
    {
        CurrentExe := "Cursor.exe"
        WinActivate
        Sleep, 50
        return true
    }

    LogEvent("DEBUG_ACTIVE", "No matching window found")
    CurrentExe := ""
    return false
}

IsSafeToSend()
{
    global UserIdleThresholdMs, LastUserActivityTick, UserCooldownMs
    global LastMouseX, LastMouseY, EnableUserGuard
    static lastReason := ""
    static lastLogTick := 0

    if (!EnableUserGuard)
        return true

    reason := ""
    
    ; 1. マウス移動の検知（微小な揺らぎは許容）
    MouseGetPos, mx, my
    diffX := Abs(mx - LastMouseX)
    diffY := Abs(my - LastMouseY)
    if (diffX > 10 || diffY > 10) ; 閾値を10pxに緩和
    {
        LastMouseX := mx
        LastMouseY := my
        LastUserActivityTick := A_TickCount
        reason := "Mouse Move: diffX=" diffX " diffY=" diffY
    }
    else if (A_TimeIdlePhysical < UserIdleThresholdMs)
    {
        ; 2. 物理的なアイドル時間を確認 (OSレベル)
        LastUserActivityTick := A_TickCount
        reason := "Physical Idle: " A_TimeIdlePhysical "ms"
    }
    else if (A_TickCount - LastUserActivityTick < UserCooldownMs)
    {
        ; 3. ユーザー操作直後のクールダウン時間
        reason := "Cooldown: " (A_TickCount - LastUserActivityTick) "ms"
    }
    else if (GetKeyState("LButton", "P") || GetKeyState("RButton", "P") || GetKeyState("MButton", "P"))
    {
        ; 4. マウスボタンの押し下げ状態 (物理的)
        LastUserActivityTick := A_TickCount
        reason := "Mouse Button"
    }
    else if (GetKeyState("Shift", "P") || GetKeyState("Ctrl", "P") || GetKeyState("Alt", "P") || GetKeyState("LWin", "P") || GetKeyState("RWin", "P"))
    {
        ; 5. 修飾キーの押し下げ状態 (物理的)
        LastUserActivityTick := A_TickCount
        reason := "Key Down"
    }
    else if (A_Cursor = "Wait" || A_Cursor = "AppStarting" || A_Cursor = "SizeAll")
    {
        ; 6. カーソル形状の監視
        LastUserActivityTick := A_TickCount
        reason := "Cursor Shape: " A_Cursor
    }

    if (reason != "")
    {
        now := A_TickCount
        if (reason != lastReason || now - lastLogTick > 3000) ; 理由が変わったか3秒経過でログ出力
        {
            LogEvent("DEBUG_SAFETY", "Blocked by " reason)
            lastReason := reason
            lastLogTick := now
        }
        return false
    }

    lastReason := ""
    return true
}
