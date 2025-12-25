#NoEnv
#SingleInstance, Force
#Persistent
SendMode, Input
SetTitleMatchMode, 2
SetWorkingDir, %A_ScriptDir%
CoordMode, Pixel, Screen
CoordMode, Mouse, Screen

global AutoEnabled := false
global RequireAdmin := true
global TargetProcessRegex := "^(Windsurf\.exe|Code\.exe|Cursor\.exe)$"
global EnableKeyboardHotkeys := false
global EnableResetHotkey := true
global AutoStartWhenWindsurfActive := false
global AutoStartWhenWindsurfRunning := false

global OrangeColor := 0xF0883E

global InstructionFile := A_ScriptDir "\..\..\docs\inbox\next_instruction.txt"
global PreserveClipboard := true

global PulseIntervalMs := 300
global MinAltEnterIntervalMs := 350
global MaxAltEnterBurstCount := 10
global AltEnterBurstCooldownMs := 2500
global FileWatchIntervalMs := 1000
global TabCloseIntervalMs := 2500
global PatrolIntervalMs := 3500
global EnablePatrol := true

global IdleThresholdMs := 700
global ClickToggleCooldownMs := 650
global RequireRightFirstForToggle := true
global RightFirstWindowMs := 350

global HudAnchorRightPx := 120
global HudAnchorTopPx := 40

global SearchAreaLeftRatio := 0.28
global SearchAreaTopRatio := 0.35
global SearchAreaRightRatio := 1.0
global SearchAreaBottomRatio := 0.98
global SearchAreaMinWidthPx := 260
global SearchAreaMinHeightPx := 220

global EnableTabCycle := true
global TabCycleMaxSteps := 10
global TabCycleCooldownMs := 6000
global TabCycleStepDelayMs := 120

global LastToggleTick := 0
global LastRDownTick := 0
global LastInstructionTime := ""
global LastWindsurfHwnd := ""
global LastAltEnterTick := 0
global AltEnterBurstCount := 0
global AltEnterBurstCooldownUntil := 0
global OrangeScanIntervalMs := 600
global OrangeFreshMs := 4500
global LastOrangeScanTick := 0
global LastOrangeFoundTick := 0
global LastOrangeX := 0
global LastOrangeY := 0
global ClickOrangeBeforeAltEnter := true
global ClickOrangeInPatrol := true
global TabCycleSteps := 0
global TabCycleCooldownUntil := 0
global TabCycleOriginHwnd := 0

if (RequireAdmin && !A_IsAdmin)
{
    Run, *RunAs "%A_ScriptFullPath%"
    ExitApp
}

Gui, +AlwaysOnTop -Caption +ToolWindow +LastFound +E0x20
Gui, Color, 666666
Gui, Font, s10 cFFFFFF, Segoe UI
Gui, Add, Text, vStatusText w80 Center, AUTO OFF

HudX := A_ScreenWidth - HudAnchorRightPx
HudY := HudAnchorTopPx
Gui, Show, % "x" HudX " y" HudY " NoActivate"

SetTimer, TimerPulse, %PulseIntervalMs%
SetTimer, TimerFileWatch, %FileWatchIntervalMs%
SetTimer, TimerCloseTabs, %TabCloseIntervalMs%
SetTimer, TimerPatrol, %PatrolIntervalMs%

#If (EnableKeyboardHotkeys && IsWindsurfActive())
F8::AutoStart()
F9::AutoStop()
#If

#If EnableResetHotkey
+Esc::AutoReset()
#If

#If IsWindsurfActive()
~RButton::HandleMouseToggle("R")
~LButton::HandleMouseToggle("L")
#If

return

AutoStart() {
    global AutoEnabled
    AutoEnabled := true
    ResetAltEnterBurst()
    UpdateIndicator()
}

AutoStop() {
    global AutoEnabled
    AutoEnabled := false
    ResetAltEnterBurst()
    UpdateIndicator()
}

AutoReset() {
    global AutoEnabled, LastInstructionTime, LastWindsurfHwnd
    AutoEnabled := false
    LastInstructionTime := ""
    LastWindsurfHwnd := ""
    ResetAltEnterBurst()
    UpdateIndicator()
}

ToggleAuto() {
    global AutoEnabled
    AutoEnabled := !AutoEnabled
    ResetAltEnterBurst()
    UpdateIndicator()
}

UpdateIndicator() {
    global AutoEnabled
    if (AutoEnabled) {
        Gui, Color, 2B6CB0
        GuiControl,, StatusText, AUTO ON
    } else {
        Gui, Color, 666666
        GuiControl,, StatusText, AUTO OFF
    }
    WinSet, Redraw
}

ResetAltEnterBurst() {
    global LastAltEnterTick, AltEnterBurstCount, AltEnterBurstCooldownUntil
    global LastOrangeScanTick, LastOrangeFoundTick, LastOrangeX, LastOrangeY
    global TabCycleSteps, TabCycleOriginHwnd
    LastAltEnterTick := 0
    AltEnterBurstCount := 0
    AltEnterBurstCooldownUntil := 0
    LastOrangeScanTick := 0
    LastOrangeFoundTick := 0
    LastOrangeX := 0
    LastOrangeY := 0
    TabCycleSteps := 0
    TabCycleOriginHwnd := 0
}

HandleMouseToggle(button) {
    global LastToggleTick, ClickToggleCooldownMs
    global RequireRightFirstForToggle, RightFirstWindowMs, LastRDownTick

    if (A_TickCount - LastToggleTick < ClickToggleCooldownMs)
        return

    if (button = "R")
    {
        LastRDownTick := A_TickCount
        return
    }

    if (button = "L")
    {
        if (!GetKeyState("RButton", "P"))
            return

        if (RequireRightFirstForToggle && (A_TickCount - LastRDownTick > RightFirstWindowMs))
            return

        LastToggleTick := A_TickCount
        ToggleAuto()
    }
}

IsWindsurfActive() {
    global TargetProcessRegex

    WinGet, pn, ProcessName, A
    if (RegExMatch(pn, TargetProcessRegex))
        return true

    WinGetTitle, t, A
    if (InStr(t, "Windsurf"))
        return true

    return false
}

IsSafeToAct() {
    global IdleThresholdMs

    if (A_TimeIdlePhysical < IdleThresholdMs)
        return false

    if (GetKeyState("LButton", "P") || GetKeyState("RButton", "P") || GetKeyState("MButton", "P"))
        return false

    if (GetKeyState("Shift", "P") || GetKeyState("Ctrl", "P") || GetKeyState("Alt", "P"))
        return false

    return true
}

SaveUserContext(ByRef hwnd, ByRef mx, ByRef my) {
    hwnd := WinExist("A")
    MouseGetPos, mx, my
}

RestoreUserContext(hwnd, mx, my) {
    if (hwnd)
        WinActivate, ahk_id %hwnd%

    DllCall("SetCursorPos", "int", mx, "int", my)
}

ActivateAnyWindsurfWindow() {
    global LastWindsurfHwnd, TargetProcessRegex

    if (LastWindsurfHwnd)
    {
        if WinExist("ahk_id " LastWindsurfHwnd)
        {
            WinActivate, % "ahk_id " LastWindsurfHwnd
            return true
        }
    }

    WinGet, idList, List
    Loop, %idList%
    {
        hwnd := idList%A_Index%
        WinGet, pn, ProcessName, ahk_id %hwnd%
        if (RegExMatch(pn, TargetProcessRegex))
        {
            LastWindsurfHwnd := hwnd
            WinActivate, ahk_id %hwnd%
            return true
        }
    }

    WinGet, idList2, List
    Loop, %idList2%
    {
        hwnd := idList2%A_Index%
        WinGetTitle, t, ahk_id %hwnd%
        if (InStr(t, "Windsurf"))
        {
            LastWindsurfHwnd := hwnd
            WinActivate, ahk_id %hwnd%
            return true
        }
    }

    return false
}

FindOrangeInActiveWindow(ByRef px, ByRef py) {
    global OrangeColor
    global SearchAreaLeftRatio, SearchAreaTopRatio, SearchAreaRightRatio, SearchAreaBottomRatio
    global SearchAreaMinWidthPx, SearchAreaMinHeightPx

    WinGetPos, wx, wy, ww, wh, A
    if (ww = "" || wh = "")
        return false

    totalRight := wx + ww
    totalBottom := wy + wh

    areaLeft := wx + Floor(ww * SearchAreaLeftRatio)
    areaTop := wy + Floor(wh * SearchAreaTopRatio)
    areaRight := wx + Ceil(ww * SearchAreaRightRatio)
    areaBottom := wy + Ceil(wh * SearchAreaBottomRatio)

    if (areaLeft < wx)
        areaLeft := wx
    if (areaTop < wy)
        areaTop := wy
    if (areaRight > totalRight)
        areaRight := totalRight
    if (areaBottom > totalBottom)
        areaBottom := totalBottom

    if (areaRight - areaLeft < SearchAreaMinWidthPx) {
        areaLeft := areaRight - SearchAreaMinWidthPx
        if (areaLeft < wx) {
            areaLeft := wx
            areaRight := wx + SearchAreaMinWidthPx
            if (areaRight > totalRight)
                areaRight := totalRight
        }
    }

    if (areaBottom - areaTop < SearchAreaMinHeightPx) {
        areaTop := areaBottom - SearchAreaMinHeightPx
        if (areaTop < wy) {
            areaTop := wy
            areaBottom := wy + SearchAreaMinHeightPx
            if (areaBottom > totalBottom)
                areaBottom := totalBottom
        }
    }

    PixelSearch, pxOut, pyOut, areaLeft, areaTop, areaRight, areaBottom, %OrangeColor%, 15, Fast RGB
    if (ErrorLevel != 0)
        return false

    px := pxOut
    py := pyOut
    return true
}

MaybeCycleTabs() {
    global EnableTabCycle, TabCycleSteps, TabCycleMaxSteps, TabCycleCooldownUntil
    global TabCycleCooldownMs, TabCycleOriginHwnd, TabCycleStepDelayMs

    if (!EnableTabCycle)
        return

    now := A_TickCount
    if (TabCycleCooldownUntil && now < TabCycleCooldownUntil)
        return

    if (!IsSafeToAct())
        return

    SaveUserContext(prevHwnd, prevX, prevY)

    if (!ActivateAnyWindsurfWindow()) {
        RestoreUserContext(prevHwnd, prevX, prevY)
        return
    }

    if (TabCycleSteps = 0)
        TabCycleOriginHwnd := WinExist("A")

    Send, ^{PgDn}
    Sleep, TabCycleStepDelayMs
    TabCycleSteps += 1

    if (TabCycleSteps >= TabCycleMaxSteps) {
        if (TabCycleOriginHwnd && WinExist("ahk_id " TabCycleOriginHwnd))
            WinActivate, ahk_id %TabCycleOriginHwnd%

        TabCycleOriginHwnd := 0
        TabCycleSteps := 0
        TabCycleCooldownUntil := now + TabCycleCooldownMs
    }

    RestoreUserContext(prevHwnd, prevX, prevY)
}

TimerPulse:
    global AutoEnabled, AutoStartWhenWindsurfActive, AutoStartWhenWindsurfRunning
    global MinAltEnterIntervalMs, MaxAltEnterBurstCount, AltEnterBurstCooldownMs
    global LastAltEnterTick, AltEnterBurstCount, AltEnterBurstCooldownUntil
    global OrangeScanIntervalMs, OrangeFreshMs, LastOrangeScanTick, LastOrangeFoundTick
    global LastOrangeX, LastOrangeY, ClickOrangeBeforeAltEnter
    global EnablePatrol, ClickOrangeInPatrol

    if (!AutoEnabled)
    {
        if (AutoStartWhenWindsurfRunning && WinExist("ahk_exe Windsurf.exe"))
            AutoStart()
        else if (AutoStartWhenWindsurfActive && IsWindsurfActive())
            AutoStart()
        return
    }

    if (!IsSafeToAct())
        return

    now := A_TickCount
    if (AltEnterBurstCooldownUntil && now < AltEnterBurstCooldownUntil)
        return

    if (!EnablePatrol && (now - LastOrangeScanTick >= OrangeScanIntervalMs))
    {
        SaveUserContext(prevHwnd, prevX, prevY)

        if (ActivateAnyWindsurfWindow())
        {
            if (FindOrangeInActiveWindow(px, py))
            {
                LastOrangeFoundTick := now
                LastOrangeX := px
                LastOrangeY := py
            }
        }

        RestoreUserContext(prevHwnd, prevX, prevY)
        LastOrangeScanTick := now
    }

    if (!LastOrangeFoundTick)
        return
    if (now - LastOrangeFoundTick > OrangeFreshMs)
        return
    if (LastAltEnterTick && (now - LastAltEnterTick < MinAltEnterIntervalMs))
        return

    SaveUserContext(prevHwnd2, prevX2, prevY2)

    if (!ActivateAnyWindsurfWindow())
    {
        RestoreUserContext(prevHwnd2, prevX2, prevY2)
        return
    }

    if (ClickOrangeBeforeAltEnter && !(EnablePatrol && ClickOrangeInPatrol) && LastOrangeX && LastOrangeY)
        Click, %LastOrangeX%, %LastOrangeY%

    Send, !{Enter}
    LastAltEnterTick := now
    AltEnterBurstCount += 1

    if (AltEnterBurstCount >= MaxAltEnterBurstCount)
    {
        AltEnterBurstCooldownUntil := now + AltEnterBurstCooldownMs
        AltEnterBurstCount := 0
    }

    Sleep, 60
    RestoreUserContext(prevHwnd2, prevX2, prevY2)
return

TimerFileWatch:
    if (!AutoEnabled)
        return
    if (!IsSafeToAct())
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

    SaveUserContext(prevHwnd, prevX, prevY)

    if (!ActivateAnyWindsurfWindow())
    {
        RestoreUserContext(prevHwnd, prevX, prevY)
        return
    }

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

    RestoreUserContext(prevHwnd, prevX, prevY)
return

TimerCloseTabs:
    if (!AutoEnabled)
        return
    if (!IsSafeToAct())
        return
    if (!IsWindsurfActive())
        return

    WinGetTitle, t, A

    if (RegExMatch(t, "(COMMIT_EDITMSG|MERGE_MSG|PULLREQ_EDITMSG|REBASE_HEAD|git-rebase-todo|\.git\\\\(COMMIT_EDITMSG|MERGE_MSG))"))
    {
        Send, ^w
        return
    }

    if (RegExMatch(t, "\\b(Commit|Index|Merge)\\b") && InStr(t, ".git"))
    {
        Send, ^w
        return
    }
return

TimerPatrol:
    global EnablePatrol
    global LastOrangeFoundTick, LastOrangeX, LastOrangeY, ClickOrangeInPatrol
    global TabCycleSteps, TabCycleOriginHwnd, TabCycleCooldownUntil

    if (!EnablePatrol)
        return
    if (!AutoEnabled)
        return
    if (!IsSafeToAct())
        return

    SaveUserContext(prevHwnd, prevX, prevY)

    found := false
    WinGet, list, List
    Loop, %list%
    {
        hwnd := list%A_Index%
        WinGet, pn, ProcessName, ahk_id %hwnd%
        if !RegExMatch(pn, TargetProcessRegex)
            continue

        WinActivate, ahk_id %hwnd%
        Sleep, 60

        if (!IsSafeToAct())
        {
            RestoreUserContext(prevHwnd, prevX, prevY)
            return
        }

        if (!FindOrangeInActiveWindow(px, py))
            continue

        LastWindsurfHwnd := hwnd
        LastOrangeFoundTick := A_TickCount
        LastOrangeX := px
        LastOrangeY := py
        if (ClickOrangeInPatrol)
            Click, %px%, %py%
        TabCycleSteps := 0
        TabCycleOriginHwnd := 0
        TabCycleCooldownUntil := 0
        found := true
        Sleep, 60
        break
    }

    RestoreUserContext(prevHwnd, prevX, prevY)

    if (!found)
        MaybeCycleTabs()
return
