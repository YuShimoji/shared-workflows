; CtlColors.ahk - AutoHotkey v1 用コントロール着色ライブラリ
; HWND (ハンドル) を数値キーとして色情報を管理します

global CtlColors_Data := {}

; CtlColors_Attach(hCtrl, bgHex, fgHex)
; bgHex / fgHex は "RRGGBB" 形式の文字列を想定 (例: "1E1E1E", "FFFFFF")
CtlColors_Attach(hCtrl, bgHex, fgHex) {
    global CtlColors_Data
    if (hCtrl = "")
        return
    
    ; HWND を数値として扱う
    hCtrl := hCtrl + 0
    
    ; 文字列を数値に変換 (0x を付与)
    bgRGB := "0x" . bgHex
    fgRGB := "0x" . fgHex
    
    ; RGB -> BGR 変換
    bgBGR := ((bgRGB & 0xFF0000) >> 16) | (bgRGB & 0x00FF00) | ((bgRGB & 0x0000FF) << 16)
    fgBGR := ((fgRGB & 0xFF0000) >> 16) | (fgRGB & 0x00FF00) | ((fgRGB & 0x0000FF) << 16)
    
    ; ブラシの作成
    hBrush := DllCall("Gdi32.dll\CreateSolidBrush", "UInt", bgBGR, "Ptr")
    
    ; データ保存 (数値キー)
    CtlColors_Data[hCtrl] := { "fg": fgBGR, "bg": bgBGR, "brush": hBrush }
    
    ; メッセージハンドラ登録 (重複登録は AHK 側で無視される)
    OnMessage(0x0133, "CtlColors_WM_HANDLER") ; WM_CTLCOLOREDIT
    OnMessage(0x0134, "CtlColors_WM_HANDLER") ; WM_CTLCOLORLISTBOX
    OnMessage(0x0135, "CtlColors_WM_HANDLER") ; WM_CTLCOLORBTN
    OnMessage(0x0138, "CtlColors_WM_HANDLER") ; WM_CTLCOLORSTATIC
    
    WinSet, Redraw,, ahk_id %hCtrl%
}

CtlColors_WM_HANDLER(wParam, lParam, msg, hwnd) {
    global CtlColors_Data
    
    ; lParam はコントロールの HWND (数値)
    if (CtlColors_Data.HasKey(lParam)) {
        data := CtlColors_Data[lParam]
        DllCall("Gdi32.dll\SetTextColor", "Ptr", wParam, "UInt", data.fg)
        DllCall("Gdi32.dll\SetBkColor", "Ptr", wParam, "UInt", data.bg)
        DllCall("Gdi32.dll\SetBkMode", "Ptr", wParam, "Int", 1) ; TRANSPARENT
        return data.brush
    }
}
