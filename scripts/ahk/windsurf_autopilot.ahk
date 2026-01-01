#Requires AutoHotkey v1.1
#SingleInstance, Force
#Persistent

; =====================================
; 1. ライブラリ読み込み (競合回避のためシンプルに記述)
; =====================================
; ファイルがあれば読み込み、なければ無視します。エラーにはなりません。
#Include *i %A_ScriptDir%\CtlColors.ahk

; =====================================
; 2. 基本設定
; =====================================
SendMode, Input
SetBatchLines, -1
SetTitleMatchMode, 2
SetWorkingDir, %A_ScriptDir%
CoordMode, Pixel, Screen
CoordMode, Mouse, Screen

; =====================================
; 3. 設定値 (初期値)
; =====================================
global IntervalMs := 300
global MinSendIntervalMs := 250
global TargetExePattern := "i)(Windsurf\.exe|Code\.exe|Cursor\.exe)"
global RequiredTitleKeywords := "Windsurf"
global OrangeColor := 0xF0883E
global OrangeColorTolerance := 40
global SendSequence := "!{Enter}"
global AutoSendMode := 0
global CommandVisibleTimeoutMs := 4000
global EnableUserGuard := true
global UserCooldownMs := 800
global PatrolIntervalSec := 5
global CleanupIntervalSec := 5
global EnablePatrol := false
global AutoCloseGitTabs := true
global EnableFileWatch := false

; 内部計算用
global PatrolIntervalMs := PatrolIntervalSec * 1000
global CleanupIntervalMs := CleanupIntervalSec * 1000

; 状態変数
global AutoEnabled := false
global GuiExpanded := false
global LastSendTime := 0
global TargetHwnd := 0
global CurrentExe := ""
global SafetyReason := ""
global LastCommandVisibleTick := 0
global LastGuiUpdateTick := 0
global InstructionFile := A_ScriptDir . "\..\..\docs\inbox\next_instruction.txt"
global LastInstructionTime := ""
global LastMouseX := 0, LastMouseY := 0
global LastUserActivityTick := A_TickCount
global LogFile := A_ScriptDir . "\windsurf_autopilot_debug.log"

; GUIカラー定義
global clGui    := "1E1E1E"
global clBox    := "252526"
global clText   := "A0A0A0"
global clVal    := "CCCCCC"
global clActive := "007ACC"
global clWhite  := "FFFFFF"

; =====================================
; 4. 設定ファイル読み込み
; =====================================
ConfigFile := A_ScriptDir . "\windsurf_autopilot.ini"
LoadConfig()

; =====================================
; 5. GUI 作成
; =====================================
MouseGetPos, LastMouseX, LastMouseY

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

Gui, Add, Text, xm y+6, Title Keyword:
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

Gui, Add, Text, xm y+6 vColorText c%clVal%, Orange: initializing...

Gui, Add, Button, xm y+2 w100 h22 vBtnPickColor gGuiPickColor, Pick Color

Gui, Add, Button, xm y+8 w80 h22 vBtnApply gApplySettings, Apply

Gui, Font, c%clText% s7, Consolas
Gui, Add, Text, vInfoText xm y+6 w200 vSectionEnd, Ready

Gui, Margin, 10, 6
HudX := A_ScreenWidth - 240
HudY := 40
Gui, Show, x%HudX% y%HudY% AutoSize, Windsurf Autopilot

; CtlColors 適用 (安全な呼び出し)
SafeAttach(hInterval, clBox, clVal)
SafeAttach(hMinSend, clBox, clVal)
SafeAttach(hTargetExe, clBox, clVal)
SafeAttach(hTitleKeywords, clBox, clVal)
SafeAttach(hSendMode, clBox, clVal)
SafeAttach(hSendKeys, clBox, clVal)
SafeAttach(hPatrol, clBox, clVal)
SafeAttach(BtnToggle, clBox, clWhite)
SafeAttach(BtnExpand, clBox, clWhite)
SafeAttach(BtnApply, clBox, clWhite)
SafeAttach(BtnPickColor, clBox, clWhite)
UpdateColorLabel()

; ダークモードタイトルバー
DllCall("dwmapi\DwmSetWindowAttribute", "Ptr", MyGuiHwnd, "Int", 19, "Int*", 1, "Int", 4)

UpdateGui()
SetTimer, InitialCollapse, -10
Gui, +LastFound
WinSet, ExStyle, +0x80 ; WS_EX_TOOLWINDOW

; タイマースタート
SetTimer, TimerMainLoop, -%IntervalMs%
SetTimer, TimerFileWatch, 1000
return

; =====================================
; 6. ヘルパー関数 (CtlColors用)
; =====================================
SafeAttach(Hwnd, Bk, Tx) {
    if (IsFunc("CtlColors_Attach")) {
        CtlColors_Attach(Hwnd, Bk, Tx)
    }
}

UpdateColorLabel() {
    global OrangeColor, ColorText
    GuiControl,, ColorText, % "Orange: " Format("0x{:06X}", OrangeColor)
}

ChooseColorDialog(initialColor := 0xFFFFFF) {
    global MyGuiHwnd
    static CustColors
    if (!VarSetCapacity(CustColors)) {
        VarSetCapacity(CustColors, 64, 0)
    }

    VarSetCapacity(cc, 36, 0)
    NumPut(36, cc, 0, "UInt")
    NumPut(MyGuiHwnd, cc, 4, "Ptr")
    NumPut(initialColor, cc, 12, "UInt")
    NumPut(&CustColors, cc, 16, "Ptr")
    NumPut(0x00000103, cc, 20, "UInt") ; CC_RGBINIT | CC_FULLOPEN

    if !DllCall("comdlg32\ChooseColor", "Ptr", &cc)
        return ""
    return NumGet(cc, 12, "UInt")
}

; =====================================
; 7. ホットキー
; =====================================
F8::ToggleAuto()
F9::SetAuto(false)
+Esc::ExitApp

; =====================================
; 8. GUIアクション
; =====================================
GuiToggle:
    ToggleAuto()
    return

ToggleExpand:
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
    UpdateGui()
    return

GuiPickColor:
    newColor := ChooseColorDialog(OrangeColor)
    if (newColor = "")
        return
    OrangeColor := newColor
    UpdateColorLabel()
    SaveConfig()
    ToolTip, % "Orange updated: " Format("0x{:06X}", OrangeColor)
    SetTimer, RemoveToolTip, -800
    return

OnPatrolSliderChange:
    Gui, Submit, NoHide
    PatrolIntervalSec := PatrolIntervalSlider
    PatrolIntervalMs := PatrolIntervalSec * 1000
    GuiControl,, PatrolIntervalLabel, Patrol Int: %PatrolIntervalSec%s
    SaveConfig()
    return

OnCleanupSliderChange:
    Gui, Submit, NoHide
    CleanupIntervalSec := CleanupIntervalSlider
    CleanupIntervalMs := CleanupIntervalSec * 1000
    GuiControl,, CleanupIntervalLabel, Cleanup Int: %CleanupIntervalSec%s
    SaveConfig()
    return

ToggleAuto() {
    global AutoEnabled
    static lastToggle := 0
    now := A_TickCount
    if (now - lastToggle < 300)
        return
    lastToggle := now
    
    AutoEnabled := !AutoEnabled
    if (AutoEnabled)
        SoundBeep, 1000, 150
    else {
        SoundBeep, 500, 150
        ToolTip ; OFF時は消す
    }
    
    LogEvent("STATE", "AutoEnabled=" (AutoEnabled ? "ON" : "OFF"))
    UpdateGui()
}

SetAuto(state) {
    global AutoEnabled
    AutoEnabled := state
    if (!AutoEnabled)
        ToolTip
    LogEvent("STATE", "AutoEnabled=" (state ? "ON" : "OFF"))
    UpdateGui()
}

UpdateGui() {
    global AutoEnabled, IntervalMs, LastSendTime, TargetHwnd, CurrentExe, SafetyReason
    global clGui, clActive, clBox, clWhite, BtnToggle, BtnExpand, LastGuiUpdateTick
    
    now := A_TickCount
    if (now - LastGuiUpdateTick < 100)
        return
    LastGuiUpdateTick := now

    static lastState := -1, lastInfo := ""
    
    if (AutoEnabled != lastState) {
        activeBtnColor := AutoEnabled ? clActive : clBox
        SafeAttach(BtnToggle, activeBtnColor, clWhite)
        GuiControl,, BtnToggle, % (AutoEnabled ? "AUTO ON" : "AUTO OFF")
        lastState := AutoEnabled
    }

    elapsed := (LastSendTime = 0) ? "N/A" : (A_TickCount - LastSendTime) "ms"
    stateInfo := SafetyReason != "" ? SafetyReason : "Active"
    info := stateInfo "`nLast: " elapsed " / Tgt: " CurrentExe
    
    if (info != lastInfo) {
        GuiControl,, InfoText, %info%
        lastInfo := info
    }
}

; =====================================
; 9. メインループ (診断ToolTip付き)
; =====================================
TimerMainLoop:
    if (!AutoEnabled) {
        SafetyReason := "Auto OFF"
        Goto, MainLoopEnd
    }

    ; --- 診断: マウス横に状態を表示 ---
    DiagMsg := "Running..."

    ; 1. ユーザー操作チェック
    if (!CheckSafety()) {
        DiagMsg := "Blocked: " . SafetyReason
        ToolTip, 🛑 %DiagMsg%
        UpdateGui()
        Goto, MainLoopEnd
    }
    
    ; 2. ターゲット特定
    if (!UpdateTarget()) {
        DiagMsg := "No Target"
        SafetyReason := "Searching..."
        ToolTip, 🔎 Searching: %RequiredTitleKeywords%`n(Exe: %TargetExePattern%)
        UpdateGui()
        Goto, MainLoopEnd
    }
    SafetyReason := "Target Found"

    ; 3. インターバル
    now := A_TickCount
    ; 4. オレンジ判定 (Mode 1の時のみ)
    if (AutoSendMode = 1) {
        if (!CheckOrange()) {
            if (now - LastCommandVisibleTick > CommandVisibleTimeoutMs) {
                if (SafetyReason != "Wait Orange") {
                    SafetyReason := "Wait Orange"
                    LogEvent("DEBUG", "Waiting for command color...")
                }
                ToolTip, 🎨 Waiting for Orange Color...
                UpdateGui()
                Goto, MainLoopEnd
            }
        } else {
            ; オレンジが見つかった場合は即座にSafetyReasonをクリア
            if (SafetyReason = "Wait Orange") {
                SafetyReason := ""
                ToolTip ; ツールチップを消す
            }
        }
    }

    ; 5. コマンド送信
    PerformSend()

MainLoopEnd:
    SetTimer, TimerMainLoop, -%IntervalMs%
    return

; =====================================
; 10. ロジック関数
; =====================================
CheckSafety() {
    global LastUserActivityTick, UserCooldownMs, LastMouseX, LastMouseY, EnableUserGuard, SafetyReason, MyGuiHwnd
    if (!EnableUserGuard)
        return true

    MouseGetPos, mx, my
    if (Abs(mx - LastMouseX) > 30 || Abs(my - LastMouseY) > 30) {
        LastMouseX := mx, LastMouseY := my, LastUserActivityTick := A_TickCount
        SafetyReason := "Mouse Moved"
        return false
    }
    
    if (WinActive("ahk_id " MyGuiHwnd)) {
        SafetyReason := "Configuring"
        return false
    }

    if (A_TimeIdlePhysical < 50) {
        LastUserActivityTick := A_TickCount
        SafetyReason := "User Input"
        return false
    }

    if (A_TickCount - LastUserActivityTick < UserCooldownMs) {
        SafetyReason := "Cooldown"
        return false
    }

    return true
}

UpdateTarget() {
    global TargetHwnd, TargetExePattern, RequiredTitleKeywords, CurrentExe
    
    activeId := WinActive("A")
    if (activeId) {
        WinGet, activeExe, ProcessName, ahk_id %activeId%
        if (RegExMatch(activeExe, TargetExePattern)) {
            WinGetTitle, activeTitle, ahk_id %activeId%
            ; キーワードが空なら許可、またはタイトルに含まれていれば許可
            if (RequiredTitleKeywords = "" || InStr(activeTitle, RequiredTitleKeywords)) {
                TargetHwnd := activeId
                CurrentExe := activeExe
                return true
            }
        }
    }
    
    if (TargetHwnd && WinExist("ahk_id " TargetHwnd)) {
        return true
    }
    
    TargetHwnd := 0
    return false
}

PerformSend() {
    global TargetHwnd, SendSequence, LastSendTime, LastUserActivityTick, SafetyReason
    
    if (!WinExist("ahk_id " TargetHwnd))
        return

    if (!WinActive("ahk_id " TargetHwnd)) {
        WinActivate, ahk_id %TargetHwnd%
        WinWaitActive, ahk_id %TargetHwnd%,, 0.5
        if (ErrorLevel) {
            SafetyReason := "Activate Fail"
            ToolTip, ❌ Activate Failed!
            return
        }
    }

    ; 送信 (Eventモードで確実に)
    SetKeyDelay, 10, 10
    SendEvent, {ShiftUp}{CtrlUp}{AltUp}{LWinUp}{RWinUp}
    Sleep, 50
    SendEvent, %SendSequence%
    
    LastSendTime := A_TickCount
    LastUserActivityTick := A_TickCount
    
    LogEvent("SEND", "Sent to HWND: " TargetHwnd)
    UpdateGui()
    
    ExecuteOptions()
}

CheckOrange() {
    global OrangeColor, OrangeColorTolerance, LastCommandVisibleTick
    WinGetPos, wx, wy, ww, wh, A
    if (ww = 0)
        return false
    
    ; 探索範囲を拡大 (中央60% -> 全域に近い範囲)
    ; Windsurfのボタンは右下にあることが多いため、全域をカバーするように修正
    searchX1 := wx
    searchY1 := wy
    searchX2 := wx + ww
    searchY2 := wy + wh
    
    ; 高速化のため、まずは右下エリアを重点的に探す
    ; (通常、入力欄やRunボタンは下部にあるため)
    bottomHalfY := wy + (wh * 0.5)
    PixelSearch, px, py, wx, bottomHalfY, wx + ww, wy + wh, OrangeColor, OrangeColorTolerance, RGB Fast
    if (!ErrorLevel) {
        LastCommandVisibleTick := A_TickCount
        return true
    }
    
    ; 見つからない場合は全域を探す
    PixelSearch, px, py, searchX1, searchY1, searchX2, searchY2, OrangeColor, OrangeColorTolerance, RGB Fast
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
    global LastPatrolTick, PatrolIntervalMs, RequiredTitleKeywords
    if (A_TickCount - LastPatrolTick < PatrolIntervalMs)
        return
    LastPatrolTick := A_TickCount
    
    WinGet, idList, List, ahk_exe Windsurf.exe
    if (idList < 2)
        return
        
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
            WinWaitActive, ahk_id %thisId%,, 0.2
            if (!ErrorLevel)
                Send, ^w
        }
    }
}

TimerFileWatch:
    if (!AutoEnabled || !EnableFileWatch || !FileExist(InstructionFile))
        return

    FileGetTime, t, %InstructionFile%, M
    if (t = "" || t = LastInstructionTime)
        return
    LastInstructionTime := t
    FileRead, content, %InstructionFile%
    if (content = "")
        return
    
    if (TargetHwnd && WinExist("ahk_id " TargetHwnd)) {
        clipSaved := ClipboardAll
        Clipboard := content
        ClipWait, 1
        WinActivate, ahk_id %TargetHwnd%
        WinWaitActive, ahk_id %TargetHwnd%,, 1
        if (!ErrorLevel) {
            Send, ^v
            Sleep, 150
            SendEvent, !{Enter}
        }
        Clipboard := clipSaved
        FileDelete, %InstructionFile%
    }
    return

LogEvent(type, details) {
    global LogFile
    if (type = "DEBUG")
        return
        
    Try {
        FileGetSize, size, %LogFile%, M
        if (size >= 1) {
            FileDelete, %LogFile%
            FileAppend, % A_Now " [INFO] Log reset`n", %LogFile%
        }
        FileAppend, % A_Now " [" type "] " details "`n", %LogFile%
    }
}

; =====================================
; 11. データの保存・読み込み
; =====================================
LoadConfig() {
    global
    if !FileExist(ConfigFile) {
        Try {
            IniWrite, 300, %ConfigFile%, Settings, IntervalMs
            IniWrite, 250, %ConfigFile%, Settings, MinSendIntervalMs
            IniWrite, i)(Windsurf\.exe|Code\.exe|Cursor\.exe), %ConfigFile%, Settings, TargetExePattern
            IniWrite, Windsurf, %ConfigFile%, Settings, RequiredTitleKeywords
            IniWrite, 0, %ConfigFile%, Settings, AutoSendMode
            IniWrite, !{Enter}, %ConfigFile%, Settings, SendSequence
            IniWrite, 0, %ConfigFile%, Settings, EnablePatrol
            IniWrite, 5, %ConfigFile%, Settings, PatrolIntervalSec
            IniWrite, 5, %ConfigFile%, Settings, CleanupIntervalSec
            IniWrite, 1, %ConfigFile%, Settings, AutoCloseGitTabs
            IniWrite, 0, %ConfigFile%, Settings, EnableFileWatch
        }
        return
    }
    
    Try {
        IniRead, IntervalMs, %ConfigFile%, Settings, IntervalMs, 300
        IniRead, MinSendIntervalMs, %ConfigFile%, Settings, MinSendIntervalMs, 250
        IniRead, TargetExePattern, %ConfigFile%, Settings, TargetExePattern, i)(Windsurf\.exe|Code\.exe|Cursor\.exe)
        IniRead, RequiredTitleKeywords, %ConfigFile%, Settings, RequiredTitleKeywords, Windsurf
        IniRead, AutoSendMode, %ConfigFile%, Settings, AutoSendMode, 0
        IniRead, SendSequence, %ConfigFile%, Settings, SendSequence, !{Enter}
        IniRead, EnablePatrol, %ConfigFile%, Settings, EnablePatrol, 0
        IniRead, PatrolIntervalSec, %ConfigFile%, Settings, PatrolIntervalSec, 5
        IniRead, CleanupIntervalSec, %ConfigFile%, Settings, CleanupIntervalSec, 5
        IniRead, AutoCloseGitTabs, %ConfigFile%, Settings, AutoCloseGitTabs, 1
        IniRead, EnableFileWatch, %ConfigFile%, Settings, EnableFileWatch, 0
        
        PatrolIntervalMs := PatrolIntervalSec * 1000
        CleanupIntervalMs := CleanupIntervalSec * 1000
    }
}

SaveConfig() {
    global
    Try {
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
}

RemoveToolTip:\r\n    ToolTip\r\n    return
