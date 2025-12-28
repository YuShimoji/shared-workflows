; CtlColors.ahk - AutoHotkey v1 用 Edit/Button 背景色変更ライブラリ
; 参考: https://www.autohotkey.com/boards/viewtopic.php?t=3893

class CtlColors {
    static brushes := {}
    
    static Attach(GuiControlHwnd, TextColor := "FFFFFF", BackColor := "000000") {
        if (!CtlColors.brushes.HasKey(BackColor))
            CtlColors.brushes[BackColor] := DllCall("CreateSolidBrush", "UInt", CtlColors.BGR(BackColor))
        
        OnMessage(0x0133, CtlColors.WM_CTLCOLOREDIT, GuiControlHwnd)
        return CtlColors.brushes[BackColor]
    }
    
    static WM_CTLCOLOREDIT(wParam, lParam, msg, hwnd) {
        static brushes := CtlColors.brushes
        static colors := {}
        
        if (!colors.HasKey(lParam)) {
            colors[lParam] := {}
        }
        
        for backColor, brush in brushes {
            DllCall("SetTextColor", "Ptr", wParam, "UInt", CtlColors.BGR("FFFFFF"))
            DllCall("SetBkColor", "Ptr", wParam, "UInt", CtlColors.BGR(backColor))
            return brush
        }
    }
    
    static BGR(RGBColor) {
        return ((RGBColor & 0xFF0000) >> 16) | (RGBColor & 0x00FF00) | ((RGBColor & 0x0000FF) << 16)
    }
}
