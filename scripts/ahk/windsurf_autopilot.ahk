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

; =====================================
; 状態変数
; =====================================

global AutoEnabled := false
global LastSendTime := 0
global CurrentExe := ""

; =====================================
; 管理者実行
; =====================================

if not A_IsAdmin
{
    Run *RunAs "%A_ScriptFullPath%"
    ExitApp
}

; =====================================
; GUI 作成
; =====================================

Gui, -MaximizeBox +MinimizeBox +AlwaysOnTop +ToolWindow
Gui, Color, 0x2D2D30
Gui, Font, cWhite s10 Bold, Segoe UI

; 行1: ステータスとトグルボタン
Gui, Add, Text, vStatusText Center w220, AUTO OFF
Gui, Add, Button, gGuiToggle xp+0 yp+24 w220, Toggle (F8)

; 行2: パラメータ編集
Gui, Font, cWhite s9, Segoe UI
Gui, Add, Text, xm y+10, Interval (ms):
Gui, Add, Edit, vIntervalEdit w70 Number cBlack, %IntervalMs%
Gui, Add, Text, x+10 yp, MinSend (ms):
Gui, Add, Edit, vMinSendEdit w70 Number cBlack, %MinSendIntervalMs%

Gui, Add, Text, xm y+6, Target Exe (regex):
Gui, Add, Edit, vTargetExeEdit w260 cBlack, %TargetExePattern%

Gui, Add, Text, xm y+6, Title Keywords (empty=disabled):
Gui, Add, Edit, vTitleKeywordsEdit w260 cBlack, %RequiredTitleKeywords%

Gui, Add, Button, gApplySettings xm y+6 w80, Apply

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

; GUI ボタン
GuiToggle:
    ToggleAuto()
    return

; 設定適用ボタン
ApplySettings:
    Gui, Submit, NoHide
    global IntervalMs, MinSendIntervalMs, TargetExePattern, RequiredTitleKeywords
    
    if (IntervalEdit >= 50)
        IntervalMs := IntervalEdit
    if (MinSendEdit >= 50)
        MinSendIntervalMs := MinSendEdit
    if (TargetExeEdit != "")
        TargetExePattern := TargetExeEdit
    if (TitleKeywordsEdit != "")
        RequiredTitleKeywords := TitleKeywordsEdit
    
    SetTimer, TimerMainLoop, %IntervalMs%
    UpdateGui()
    return

; メインループタイマー
TimerMainLoop:
    MainLoop()
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

    status := AutoEnabled ? "AUTO ON" : "AUTO OFF"
    color  := AutoEnabled ? "0x0078D4" : "0x2D2D30"

    GuiControl,, StatusText, %status%
    Gui, Color, %color%

    elapsed := (LastSendTime = 0) ? "N/A" : (A_TickCount - LastSendTime) " ms"
    info := "Interval:" IntervalMs "  MinSend:" MinSendIntervalMs "  Exe:" (CurrentExe = "" ? "-" : CurrentExe) "  LastSend:" elapsed
    GuiControl,, InfoText, %info%
}

EnsureTargetActive()
{
    global TargetExePattern, RequiredTitleKeywords, CurrentExe

    ; アクティブウィンドウのチェック
    WinGet, id, ID, A
    if (id != "")
    {
        WinGet, exe, ProcessName, ahk_id %id%
        WinGetTitle, title, ahk_id %id%
        CurrentExe := exe
        
        if (RegExMatch(exe, TargetExePattern))
        {
            ; タイトルキーワードチェック
            if (RequiredTitleKeywords = "")
                return true
            if (InStr(title, RequiredTitleKeywords))
                return true
        }
    }

    ; 対象ウィンドウを探して起動
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

MainLoop()
{
    global AutoEnabled, MinSendIntervalMs, LastSendTime, EnableOrangeDetection
    global OrangeColor, OrangeColorTolerance

    if (!AutoEnabled)
        return

    if !EnsureTargetActive()
        return

    now := A_TickCount
    if (now - LastSendTime < MinSendIntervalMs)
        return

    ; オレンジ検知が有効な場合、PixelSearch でチェック
    if (EnableOrangeDetection)
    {
        if !FindOrangeInWindow(orangeX, orangeY)
            return
    }

    ; Alt+Enter 送信
    Send, !{Enter}
    LastSendTime := now
    UpdateGui()
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
