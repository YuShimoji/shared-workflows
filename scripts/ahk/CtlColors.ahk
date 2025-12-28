; CtlColors.ahk - AutoHotkey v1 用 Edit/Button 背景色変更ライブラリ
; WM_CTLCOLOREDIT メッセージを使用して Edit ボックスの背景色を変更

global CtlColors_Brushes := {}
global CtlColors_Colors := {}

CtlColors_Attach(GuiControlHwnd, TextColor, BackColor) {
    global CtlColors_Brushes, CtlColors_Colors
    
    if (!CtlColors_Brushes.HasKey(BackColor)) {
        CtlColors_Brushes[BackColor] := DllCall("CreateSolidBrush", "UInt", CtlColors_BGR(BackColor))
    }
    
    CtlColors_Colors[GuiControlHwnd] := { "TextColor": TextColor, "BackColor": BackColor }
    OnMessage(0x0133, "CtlColors_WM_CTLCOLOREDIT")
}

CtlColors_WM_CTLCOLOREDIT(wParam, lParam, msg, hwnd) {
    global CtlColors_Brushes, CtlColors_Colors
    
    if (CtlColors_Colors.HasKey(lParam)) {
        color := CtlColors_Colors[lParam]
        textColor := CtlColors_BGR(color["TextColor"])
        backColor := CtlColors_BGR(color["BackColor"])
        
        DllCall("SetTextColor", "Ptr", wParam, "UInt", textColor)
        DllCall("SetBkColor", "Ptr", wParam, "UInt", backColor)
        
        return CtlColors_Brushes[color["BackColor"]]
    }
}

CtlColors_BGR(RGBColor) {
    return ((RGBColor & 0xFF0000) >> 16) | (RGBColor & 0x00FF00) | ((RGBColor & 0x0000FF) << 16)
}
