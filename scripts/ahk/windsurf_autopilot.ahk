#Requires AutoHotkey v1.1
#SingleInstance, Force
#Persistent
#Include %A_ScriptDir%\CtlColors.ahk

; 送信モードの安定化
SendMode, Event
SetKeyDelay, 40, 40
SetTitleMatchMode, 2  ; 部分一致に変更し、より確実に捕捉
SetWorkingDir, %A_ScriptDir%
CoordMode, Pixel, Screen
CoordMode, Mouse, Screen

; =====================================
; 設定値
; =====================================
global IntervalMs := 300
global MinSendIntervalMs := 250
global TargetExePattern := "^(Windsurf\.exe|Code\.exe|Cursor\.exe)$"
global RequiredTitleKeywords := "Windsurf"
global EnableOrangeDetection := false
global OrangeColor := 0xF0883E
global OrangeColorTolerance := 25
global SendSequence := "!{Enter}"
global AutoSendMode := 0
global CommandVisibleTimeoutMs := 4000
global EnableUserGuard := true
global UserIdleThresholdMs := 500
global LastUserActivityTick := 0
global UserCooldownMs := 800
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
global EnableFileWatch := false

; GUIカラー定義 (VS Code Dark)
global clGui    := "1E1E1E"
global clBox    := "252526"
global clText   := "A0A0A0"
global clVal    := "CCCCCC"
global clActive := "007ACC"
global clWhite  := "FFFFFF"

; =====================================
; 状態変数
; =====================================
global AutoEnabled := false
global GuiExpanded := false
global LastSendTime := 0
global TargetHwnd := 0
global CurrentExe := ""
global SafetyReason := ""
global LastCommandVisibleTick := 0
global LastGuiUpdateTick := 0
global GuiUpdateIntervalMs := 150
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
; GUI 作成
; =====================================
LogFile := A_ScriptDir "\windsurf_autopilot_debug.log"
MouseGetPos, LastMouseX, LastMouseY
LastUserActivityTick := A_TickCount

Gui, +HwndMyGuiHwnd -MaximizeBox +MinimizeBox +AlwaysOnTop +ToolWindow
Menu, Tray, NoStandard
Menu, Tray, Add, Show/Hide, TrayToggleGui
Menu, Tray, Add, Exit, TrayExit
Menu, Tray, Default, Show/Hide
Menu, Tray, Tip, Windsurf Autopilot

Gui, Color, %clGui%
Gui, Font, c%clWhite% s9 Bold, Segoe UI

; メインコントロール
Gui, Add, Button, x10 y8 w100 h24 vBtnToggle gGuiToggle, AUTO OFF
Gui, Add, Button, x+2 y8 w22 h24 vBtnExpand gToggleExpand, ▼

Gui, Font, c%clText% s8 Normal, Segoe UI
Gui, Add, Text, xm y+10 vSectionStart, Interval (ms):
Gui, Add, Edit, vIntervalEdit w60 Number HwndhInterval -E0x200, %IntervalMs%
Gui, Add, Text, x+8 yp, Min (ms):
Gui, Add, Edit, vMinSendEdit w60 Number HwndhMinSend -E0x200, %MinSendIntervalMs%

Gui, Add, Text, xm y+6, Target Exe (regex):
Gui, Add, Edit, vTargetExeEdit w200 HwndhTargetExe -E0x200, %TargetExePattern%

Gui, Add, Text, xm y+6, Title:
Gui, Add, Edit, vTitleKeywordsEdit w200 HwndhTitleKeywords -E0x200, %RequiredTitleKeywords%

Gui, Add, Text, xm y+6, Mode:
autoSendModeIndex := AutoSendMode + 1
Gui, Add, DropDownList, vSendModeDDL w200 Choose%autoSendModeIndex% HwndhSendMode -Theme -E0x200, Always|Only when command visible

Gui, Add, Text, xm y+6, Send Keys:
Gui, Add, Edit, vSendKeysEdit w200 HwndhSendKeys -E0x200, %SendSequence%

Gui, Add, Text, xm y+6, Patrol:
patrolIndex := EnablePatrol ? 2 : 1
Gui, Add, DropDownList, vPatrolDDL w200 Choose%patrolIndex% HwndhPatrol -Theme -E0x200, Off|On

Gui, Add, Text, xm y+6 vPatrolIntervalLabel, Patrol Int: %PatrolIntervalSec%s
Gui, Add, Slider, xm y+0 w200 vPatrolIntervalSlider Range1-30 ToolTip gOnPatrolSliderChange -Theme, %PatrolIntervalSec%

Gui, Add, Text, xm y+6 vCleanupIntervalLabel, Cleanup Int: %CleanupIntervalSec%s
Gui, Add, Slider, xm y+0 w200 vCleanupIntervalSlider Range1-30 ToolTip gOnCleanupSliderChange -Theme, %CleanupIntervalSec%

Gui, Add, Checkbox, xm y+6 vEnableFileWatchCheck Checked%EnableFileWatch% Background%clGui% c%clVal%, File Watch (!{Enter})

Gui, Add, Button, xm y+8 w80 h22 vBtnApply gApplySettings, Apply

Gui, Font, c%clText% s7, Consolas
Gui, Add, Text, vInfoText xm y+6 w200 vSectionEnd, 

Gui, Margin, 10, 6
HudX := A_ScreenWidth - 240
HudY := 40
Gui, Show, x%HudX% y%HudY% AutoSize, Windsurf Autopilot

; CtlColorsによる着色適用
CtlColors_Attach(MyGuiHwnd, clGui, clVal)
CtlColors_Attach(hInterval, clBox, clVal)
CtlColors_Attach(hMinSend, clBox, clVal)
CtlColors_Attach(hTargetExe, clBox, clVal)
CtlColors_Attach(hTitleKeywords, clBox, clVal)
CtlColors_Attach(hSendMode, clBox, clVal)
CtlColors_Attach(hSendKeys, clBox, clVal)
CtlColors_Attach(hPatrol, clBox, clVal)
CtlColors_Attach(BtnToggle, clBox, clWhite)
CtlColors_Attach(BtnExpand, clBox, clWhite)
CtlColors_Attach(BtnApply, clBox, clWhite)

; ダークモード化
DllCall("dwmapi\DwmSetWindowAttribute", "Ptr", MyGuiHwnd, "Int", 19, "Int*", 1, "Int", 4)

UpdateGui()
SetTimer, InitialCollapse, -10
Gui, +LastFound
WinSet, ExStyle, +0x80 ; WS_EX_TOOLWINDOW

SetTimer, TimerMainLoop, %IntervalMs%
SetTimer, TimerFileWatch, 1000
return

; =====================================
; ホットキー
; =====================================
F8::ToggleAuto()
F9::SetAuto(false)
+Esc::ExitApp

; =====================================
; ラベル・関数定義
; =====================================

GuiToggle:
    Critical
    ToggleAuto()
    return

ToggleExpand:
    Critical
    GuiExpanded := !GuiExpanded
    if (GuiExpanded) {
        GuiControl,, BtnExpand, ▲
        Gui, Show, AutoSize
    } else {
        GuiControl,, BtnExpand, ▼
        WinGetPos,,, ww, wh, ahk_id %MyGuiHwnd%
        Gui, Show, w%ww% h42
    }
    return

TrayToggleGui:
    if DllCall("IsWindowVisible", "Ptr", MyGuiHwnd)
        Gui, Hide
    else
        Gui, Show
    return

TrayExit:
    ExitApp
    return

InitialCollapse:
    GuiExpanded := false
    GuiControl,, BtnExpand, ▼
    WinGetPos,,, ww, wh, ahk_id %MyGuiHwnd%
    Gui, Show, w%ww% h42
    return

ApplySettings:
    Critical
    Gui, Submit, NoHide
    if (IntervalEdit >= 50)
        IntervalMs := IntervalEdit
    if (MinSendEdit >= 50)
        MinSendIntervalMs := MinSendEdit
    TargetExePattern := TargetExeEdit
    RequiredTitleKeywords := TitleKeywordsEdit
    SendSequence := SendKeysEdit
    AutoSendMode := InStr(SendModeDDL, "Only when") ? 1 : 0
    EnablePatrol := InStr(PatrolDDL, "On") ? true : false
    PatrolIntervalSec := PatrolIntervalSlider
    PatrolIntervalMs := PatrolIntervalSec * 1000
    CleanupIntervalSec := CleanupIntervalSlider
    CleanupIntervalMs := CleanupIntervalSec * 1000
    EnableFileWatch := EnableFileWatchCheck
    SaveConfig()
    SetTimer, TimerMainLoop, %IntervalMs%
    UpdateGui()
    return

OnPatrolSliderChange:
    Gui, Submit, NoHide
    PatrolIntervalSec := PatrolIntervalSlider
    PatrolIntervalMs := PatrolIntervalSec * 1000
    GuiControl,, PatrolIntervalLabel, Patrol Int: %PatrolIntervalSec%s
    return

OnCleanupSliderChange:
    Gui, Submit, NoHide
    CleanupIntervalSec := CleanupIntervalSlider
    CleanupIntervalMs := CleanupIntervalSec * 1000
    GuiControl,, CleanupIntervalLabel, Cleanup Int: %CleanupIntervalSec%s
    return

ToggleAuto() {
    global AutoEnabled
    AutoEnabled := !AutoEnabled
    LogEvent("STATE", "AutoEnabled=" (AutoEnabled ? "ON" : "OFF"))
    UpdateGui()
}

SetAuto(state) {
    global AutoEnabled
    AutoEnabled := state
    LogEvent("STATE", "AutoEnabled=" (state ? "ON" : "OFF"))
    UpdateGui()
}

UpdateGui() {
    global AutoEnabled, IntervalMs, LastSendTime, TargetHwnd, CurrentExe, SafetyReason
    global clGui, clActive, clBox, clWhite, BtnToggle, BtnExpand, LastGuiUpdateTick, GuiUpdateIntervalMs
    static lastState := -1, lastInfo := ""

    now := A_TickCount
    if (now - LastGuiUpdateTick < GuiUpdateIntervalMs)
        return
    LastGuiUpdateTick := now

    if (AutoEnabled != lastState) {
        activeBtnColor := AutoEnabled ? clActive : clBox
        CtlColors_Attach(BtnToggle, activeBtnColor, clWhite)
        GuiControl,, BtnToggle, % (AutoEnabled ? "AUTO ON" : "AUTO OFF")
        lastState := AutoEnabled
    }

    elapsed := (LastSendTime = 0) ? "N/A" : (A_TickCount - LastSendTime) "ms"
    stateInfo := SafetyReason != "" ? "BLOCKED: " SafetyReason : "Running"
    info := stateInfo "`nLast: " elapsed " / Target: " CurrentExe
    
    if (info != lastInfo) {
        GuiControl,, InfoText, %info%
        lastInfo := info
    }
}

TimerMainLoop:
    if (!AutoEnabled) {
        SafetyReason := ""
        return
    }

    ; 1. ユーザー操作チェック (安全性)
    if (!CheckSafety()) {
        UpdateGui()
        return
    }
    
    ; ターゲットの特定
    if (!UpdateTarget()) {
        if (SafetyReason != "No Target") {
            SafetyReason := "No Target"
            LogEvent("DEBUG", "Target not found. Pattern: " TargetExePattern " Title: " RequiredTitleKeywords)
        }
        UpdateGui()
        return
    }
    SafetyReason := ""

    ; 3. インターバル確認
    now := A_TickCount
    if (now - LastSendTime < MinSendIntervalMs) {
        UpdateGui()
        return
    }

    ; 4. オレンジ色判定 (Mode 1 の場合)
    if (AutoSendMode = 1 && !CheckOrange()) {
        if (now - LastCommandVisibleTick > CommandVisibleTimeoutMs) {
            if (SafetyReason != "No Command (Orange)") {
                SafetyReason := "No Command (Orange)"
                LogEvent("DEBUG", "Orange not found in window.")
            }
            UpdateGui()
            return
        }
    }

    ; 5. 送信実行
    LogEvent("DEBUG", "Attempting Send to HWND: " TargetHwnd " (Exe: " CurrentExe ")")
    PerformSend()
    return

CheckSafety() {
    global LastUserActivityTick, UserCooldownMs, LastMouseX, LastMouseY, EnableUserGuard, SafetyReason, MyGuiHwnd
    if (!EnableUserGuard)
        return true

    ; マウス移動の検知 (閾値 30px)
    MouseGetPos, mx, my
    if (Abs(mx - LastMouseX) > 30 || Abs(my - LastMouseY) > 30) {
        LastMouseX := mx, LastMouseY := my, LastUserActivityTick := A_TickCount
        SafetyReason := "Mouse Move"
        ToolTip, %SafetyReason%
        SetTimer, RemoveToolTip, -1000
        return false
    }
    
    ; スクリプト自体のGUIがアクティブな間は、一部の判定をスキップ（自己ロック回避）
    activeHwnd := WinActive("A")
    if (activeHwnd = MyGuiHwnd) {
        SafetyReason := "GUI Operating"
        ; ToolTip は出さない（操作の邪魔になるため）
        return false
    }

    ; 物理キーボード/マウス入力 (閾値 50ms)
    if (A_TimeIdlePhysical < 50) {
        LastUserActivityTick := A_TickCount
        SafetyReason := "User Physical Input"
        ToolTip, %SafetyReason%
        SetTimer, RemoveToolTip, -1000
        return false
    }

    ; マウスボタン（物理状態）
    if (GetKeyState("LButton", "P") || GetKeyState("RButton", "P") || GetKeyState("MButton", "P")) {
        SafetyReason := "Mouse Button"
        ToolTip, %SafetyReason%
        SetTimer, RemoveToolTip, -1000
        return false
    }

    ; 修飾キー / Esc（物理状態）
    if (GetKeyState("Shift", "P") || GetKeyState("Ctrl", "P") || GetKeyState("Alt", "P") || GetKeyState("LWin", "P") || GetKeyState("RWin", "P") || GetKeyState("Esc", "P")) {
        SafetyReason := "Modifier Key"
        ToolTip, %SafetyReason%
        SetTimer, RemoveToolTip, -1000
        return false
    }
    
    ; 入力後のクールダウン (200ms: 送信間隔300msより短く設定)
    if (A_TickCount - LastUserActivityTick < 200) {
        SafetyReason := "Cooldown"
        return false
    }

    return true
}

RemoveToolTip:
    ToolTip
    return

UpdateTarget() {
    global TargetHwnd, TargetExePattern, RequiredTitleKeywords, CurrentExe
    
    ; 1. 現在アクティブなウィンドウがターゲット候補か確認 (最優先)
    activeId := WinActive("A")
    if (activeId) {
        WinGet, activeExe, ProcessName, ahk_id %activeId%
        ; 大文字小文字を無視して比較
        if (RegExMatch(activeExe, "i)Windsurf\.exe|Code\.exe|Cursor\.exe")) {
            WinGetTitle, activeTitle, ahk_id %activeId%
            if (RequiredTitleKeywords = "" || InStr(activeTitle, RequiredTitleKeywords)) {
                TargetHwnd := activeId
                CurrentExe := activeExe
                return true
            }
        }
    }

    ; 2. 既存のターゲットが有効（存在かつ可視）か確認
    if (TargetHwnd && WinExist("ahk_id " TargetHwnd)) {
        WinGet, style, Style, ahk_id %TargetHwnd%
        if (style & 0x10000000) ; WS_VISIBLE
            return true
    }

    ; 3. 新規検索 (プロセス名で優先順位付け)
    processList := ["Windsurf.exe", "Code.exe", "Cursor.exe"]
    for index, exeName in processList {
        if WinExist("ahk_exe " exeName) {
            matchId := WinExist("ahk_exe " exeName)
            WinGetTitle, title, ahk_id %matchId%
            if (RequiredTitleKeywords = "" || InStr(title, RequiredTitleKeywords)) {
                TargetHwnd := matchId
                CurrentExe := exeName
                return true
            }
        }
    }
    
    TargetHwnd := 0
    CurrentExe := ""
    return false
}

PerformSend() {
    global TargetHwnd, SendSequence, LastSendTime, LastUserActivityTick, SafetyReason
    
    ; 送信直前にターゲットがまだ存在するか最終確認
    if (!WinExist("ahk_id " TargetHwnd)) {
        SafetyReason := "Target Lost"
        return
    }

    ; 最小化されている場合は復帰させる
    WinGet, minMax, MinMax, ahk_id %TargetHwnd%
    if (minMax = -1) {
        WinRestore, ahk_id %TargetHwnd%
        WinWait, ahk_id %TargetHwnd%,, 0.5
    }

    ; アクティブ化
    if (!WinActive("ahk_id " TargetHwnd)) {
        WinActivate, ahk_id %TargetHwnd%
        WinWaitActive, ahk_id %TargetHwnd%,, 1.0  ; 待機時間を1秒に延長
        if (ErrorLevel) {
            SafetyReason := "Activate Failed"
            return
        }
    }

    ; 送信前の安全なディレイ
    Sleep, 100

    ; 送信 (SendEvent は冒頭で定義済み)
    ; 修飾キーの強制解除
    Send, {ShiftUp}{CtrlUp}{AltUp}{LWinUp}{RWinUp}
    Sleep, 50
    
    ; コマンド送信
    Send, %SendSequence%
    
    LastSendTime := A_TickCount
    ; 自身の送信によるPhysical Input検知を回避するため、ActivityTickを更新
    LastUserActivityTick := A_TickCount
    
    LogEvent("SEND_SUCCESS", "Keys=" SendSequence " HWND=" TargetHwnd)
    UpdateGui()
    ExecuteOptions()
}

CheckOrange() {
    global OrangeColor, OrangeColorTolerance, LastCommandVisibleTick
    WinGetPos, wx, wy, ww, wh, A
    if (ww = 0)
        return false
    searchX := wx + (ww * 0.2), searchY := wy + (wh * 0.2)
    searchW := ww * 0.8, searchH := wh * 0.8
    PixelSearch,,, searchX, searchY, searchX + searchW, searchY + searchH, OrangeColor, OrangeColorTolerance, RGB
    if (!ErrorLevel) {
        LastCommandVisibleTick := A_TickCount
        return true
    }
    return false
}

ExecuteOptions() {
    global EnablePatrol, AutoCloseGitTabs
    if (EnablePatrol)
        DoPatrol()
    if (AutoCloseGitTabs)
        DoCleanup()
}

DoPatrol() {
    global LastPatrolTick, PatrolIntervalMs, RequiredTitleKeywords, TargetHwnd
    if (A_TickCount - LastPatrolTick < PatrolIntervalMs)
        return
    LastPatrolTick := A_TickCount
    
    WinGet, idList, List, ahk_exe Windsurf.exe
    if (idList < 2)
        return
        
    ; 次のウィンドウを探してアクティブ化
    activeId := WinActive("A")
    Loop, %idList% {
        thisId := idList%A_Index%
        if (thisId = activeId)
            continue
        WinGetTitle, title, ahk_id %thisId%
        if (RequiredTitleKeywords != "" && !InStr(title, RequiredTitleKeywords))
            continue
        WinActivate, ahk_id %thisId%
        break
    }
}

DoCleanup() {
    global LastCleanupTick, CleanupIntervalMs
    if (A_TickCount - LastCleanupTick < CleanupIntervalMs)
        return
    LastCleanupTick := A_TickCount
    
    WinGet, idList, List, ahk_exe Windsurf.exe
    Loop, %idList% {
        thisId := idList%A_Index%
        WinGetTitle, title, ahk_id %thisId%
        if (RegExMatch(title, "COMMIT_EDITMSG|MERGE_MSG|SQUASH_MSG")) {
            WinActivate, ahk_id %thisId%
            WinWaitActive, ahk_id %thisId%,, 0.5
            if (!ErrorLevel)
                Send, ^w
        }
    }
}

TimerFileWatch:
    if (!AutoEnabled || !EnableFileWatch || !FileExist(InstructionFile))
        return
    if (!TargetHwnd || !WinExist("ahk_id " TargetHwnd))
        return
    FileGetTime, t, %InstructionFile%, M
    if (t = "" || t = LastInstructionTime)
        return
    LastInstructionTime := t
    FileRead, content, %InstructionFile%
    if (content = "")
        return
    
    clipSaved := ClipboardAll
    Clipboard := content
    ClipWait, 1
    WinActivate, ahk_id %TargetHwnd%
    WinWaitActive, ahk_id %TargetHwnd%,, 1
    if (!ErrorLevel) {
        Send, ^v
        Sleep, 100
        Send, !{Enter}
    }
    Clipboard := clipSaved
    FileDelete, %InstructionFile%
    return

LogEvent(type, details) {
    global LogFile
    FileAppend, % A_Now " [" type "] " details "`n", %LogFile%
}

LoadConfig() {
    global
    if !FileExist(ConfigFile)
        return
    IniRead, IntervalMs, %ConfigFile%, Settings, IntervalMs, 300
    IniRead, MinSendIntervalMs, %ConfigFile%, Settings, MinSendIntervalMs, 250
    IniRead, TargetExePattern, %ConfigFile%, Settings, TargetExePattern, ^(Windsurf\.exe|Code\.exe|Cursor\.exe)$
    IniRead, RequiredTitleKeywords, %ConfigFile%, Settings, RequiredTitleKeywords, Windsurf
    IniRead, AutoSendMode, %ConfigFile%, Settings, AutoSendMode, 0
    IniRead, SendSequence, %ConfigFile%, Settings, SendSequence, !{Enter}
    IniRead, EnablePatrol, %ConfigFile%, Settings, EnablePatrol, 0
    IniRead, PatrolIntervalSec, %ConfigFile%, Settings, PatrolIntervalSec, 5
    PatrolIntervalMs := PatrolIntervalSec * 1000
    IniRead, CleanupIntervalSec, %ConfigFile%, Settings, CleanupIntervalSec, 5
    CleanupIntervalMs := CleanupIntervalSec * 1000
    IniRead, AutoCloseGitTabs, %ConfigFile%, Settings, AutoCloseGitTabs, 1
    IniRead, EnableFileWatch, %ConfigFile%, Settings, EnableFileWatch, 0
}

SaveConfig() {
    global
    IniWrite, %IntervalMs%, %ConfigFile%, Settings, IntervalMs
    IniWrite, %MinSendIntervalMs%, %ConfigFile%, Settings, MinSendIntervalMs
    IniWrite, %TargetExePattern%, %ConfigFile%, Settings, TargetExePattern
    IniWrite, %RequiredTitleKeywords%, %ConfigFile%, Settings, RequiredTitleKeywords
    IniWrite, %AutoSendMode%, %ConfigFile%, Settings, AutoSendMode
    IniWrite, %SendSequence%, %ConfigFile%, Settings, SendSequence
    IniWrite, % (EnablePatrol ? 1 : 0), %ConfigFile%, Settings, EnablePatrol
    IniWrite, %PatrolIntervalSec%, %ConfigFile%, Settings, PatrolIntervalSec
    IniWrite, %CleanupIntervalSec%, %ConfigFile%, Settings, CleanupIntervalSec
    IniWrite, % (AutoCloseGitTabs ? 1 : 0), %ConfigFile%, Settings, AutoCloseGitTabs
    IniWrite, % (EnableFileWatch ? 1 : 0), %ConfigFile%, Settings, EnableFileWatch
}
