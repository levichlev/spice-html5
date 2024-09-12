"use strict";
/*
   Copyright (C) 2012 by Aric Stewart <aric@codeweavers.com>

   This file is part of spice-html5.

   spice-html5 is free software: you can redistribute it and/or modify
   it under the terms of the GNU Lesser General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   spice-html5 is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Lesser General Public License for more details.

   You should have received a copy of the GNU Lesser General Public License
   along with spice-html5.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
 * Copyright 1990,91 by Thomas Roell, Dinkelscherben, Germany.
 *
 * Permission to use, copy, modify, distribute, and sell this software and its
 * documentation for any purpose is hereby granted without fee, provided that
 * the above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation, and that the name of Thomas Roell not be used in
 * advertising or publicity pertaining to distribution of the software without
 * specific, written prior permission.  Thomas Roell makes no representations
 * about the suitability of this software for any purpose.  It is provided
 * "as is" without express or implied warranty.
 *
 * THOMAS ROELL DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE,
 * INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS, IN NO
 * EVENT SHALL THOMAS ROELL BE LIABLE FOR ANY SPECIAL, INDIRECT OR
 * CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
 * DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 *
 */
/*
 * Copyright (c) 1994-2003 by The XFree86 Project, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE COPYRIGHT HOLDER(S) OR AUTHOR(S) BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * Except as contained in this notice, the name of the copyright holder(s)
 * and author(s) shall not be used in advertising or otherwise to promote
 * the sale, use or other dealings in this Software without prior written
 * authorization from the copyright holder(s) and author(s).
 */

/*
 * NOTE: The AT/MF keyboards can generate (via the 8042) two (MF: three)
 *       sets of scancodes. Set3 can only be generated by a MF keyboard.
 *       Set2 sends a makecode for keypress, and the same code prefixed by a
 *       F0 for keyrelease. This is a little bit ugly to handle. Thus we use
 *       here for X386 the PC/XT compatible Set1. This set uses 8bit scancodes.
 *       Bit 7 ist set if the key is released. The code E0 switches to a
 *       different meaning to add the new MF cursorkeys, while not breaking old
 *       applications. E1 is another special prefix. Since I assume that there
 *       will be further versions of PC/XT scancode compatible keyboards, we
 *       may be in trouble one day.
 *
 * IDEA: 1) Use Set2 on AT84 keyboards and translate it to MF Set3.
 *       2) Use the keyboards native set and translate it to common keysyms.
 */


var KeyNames = {
/*
 * definition of the AT84/MF101/MF102 Keyboard:
 * ============================================================
 *       Defined             Key Cap Glyphs       Pressed value
 *      Key Name            Main       Also       (hex)    (dec)
 *      ----------------   ---------- -------    ------    ------
 */
  KEY_Escape      :/* Escape                0x01  */    1,
  KEY_1           :/* 1           !         0x02  */    2,
  KEY_2           :/* 2           @         0x03  */    3,
  KEY_3           :/* 3           #         0x04  */    4,
  KEY_4           :/* 4           $         0x05  */    5,
  KEY_5           :/* 5           %         0x06  */    6,
  KEY_6           :/* 6           ^         0x07  */    7,
  KEY_7           :/* 7           &         0x08  */    8,
  KEY_8           :/* 8           *         0x09  */    9,
  KEY_9           :/* 9           (         0x0a  */   10,
  KEY_0           :/* 0           )         0x0b  */   11,
  KEY_Minus       :/* - (Minus)   _ (Under) 0x0c  */   12,
  KEY_Equal       :/* = (Equal)   +         0x0d  */   13,
  KEY_BackSpace   :/* Back Space            0x0e  */   14,
  KEY_Tab         :/* Tab                   0x0f  */   15,
  KEY_Q           :/* Q                     0x10  */   16,
  KEY_W           :/* W                     0x11  */   17,
  KEY_E           :/* E                     0x12  */   18,
  KEY_R           :/* R                     0x13  */   19,
  KEY_T           :/* T                     0x14  */   20,
  KEY_Y           :/* Y                     0x15  */   21,
  KEY_U           :/* U                     0x16  */   22,
  KEY_I           :/* I                     0x17  */   23,
  KEY_O           :/* O                     0x18  */   24,
  KEY_P           :/* P                     0x19  */   25,
  KEY_LBrace      :/* [           {         0x1a  */   26,
  KEY_RBrace      :/* ]           }         0x1b  */   27,
  KEY_Enter       :/* Enter                 0x1c  */   28,
  KEY_LCtrl       :/* Ctrl(left)            0x1d  */   29,
  KEY_A           :/* A                     0x1e  */   30,
  KEY_S           :/* S                     0x1f  */   31,
  KEY_D           :/* D                     0x20  */   32,
  KEY_F           :/* F                     0x21  */   33,
  KEY_G           :/* G                     0x22  */   34,
  KEY_H           :/* H                     0x23  */   35,
  KEY_J           :/* J                     0x24  */   36,
  KEY_K           :/* K                     0x25  */   37,
  KEY_L           :/* L                     0x26  */   38,
  KEY_SemiColon   :/* ;(SemiColon) :(Colon) 0x27  */   39,
  KEY_Quote       :/* ' (Apostr)  " (Quote) 0x28  */   40,
  KEY_Tilde       :/* ` (Accent)  ~ (Tilde) 0x29  */   41,
  KEY_ShiftL      :/* Shift(left)           0x2a  */   42,
  KEY_BSlash      :/* \(BckSlash) |(VertBar)0x2b  */   43,
  KEY_Z           :/* Z                     0x2c  */   44,
  KEY_X           :/* X                     0x2d  */   45,
  KEY_C           :/* C                     0x2e  */   46,
  KEY_V           :/* V                     0x2f  */   47,
  KEY_B           :/* B                     0x30  */   48,
  KEY_N           :/* N                     0x31  */   49,
  KEY_M           :/* M                     0x32  */   50,
  KEY_Comma       :/* , (Comma)   < (Less)  0x33  */   51,
  KEY_Period      :/* . (Period)  >(Greater)0x34  */   52,
  KEY_Slash       :/* / (Slash)   ?         0x35  */   53,
  KEY_ShiftR      :/* Shift(right)          0x36  */   54,
  KEY_KP_Multiply :/* *                     0x37  */   55,
  KEY_Alt         :/* Alt(left)             0x38  */   56,
  KEY_Space       :/*   (SpaceBar)          0x39  */   57,
  KEY_CapsLock    :/* CapsLock              0x3a  */   58,
  KEY_F1          :/* F1                    0x3b  */   59,
  KEY_F2          :/* F2                    0x3c  */   60,
  KEY_F3          :/* F3                    0x3d  */   61,
  KEY_F4          :/* F4                    0x3e  */   62,
  KEY_F5          :/* F5                    0x3f  */   63,
  KEY_F6          :/* F6                    0x40  */   64,
  KEY_F7          :/* F7                    0x41  */   65,
  KEY_F8          :/* F8                    0x42  */   66,
  KEY_F9          :/* F9                    0x43  */   67,
  KEY_F10         :/* F10                   0x44  */   68,
  KEY_NumLock     :/* NumLock               0x45  */   69,
  KEY_ScrollLock  :/* ScrollLock            0x46  */   70,
  KEY_KP_7        :/* 7           Home      0x47  */   71,
  KEY_KP_8        :/* 8           Up        0x48  */   72,
  KEY_KP_9        :/* 9           PgUp      0x49  */   73,
  KEY_KP_Minus    :/* - (Minus)             0x4a  */   74,
  KEY_KP_4        :/* 4           Left      0x4b  */   75,
  KEY_KP_5        :/* 5                     0x4c  */   76,
  KEY_KP_6        :/* 6           Right     0x4d  */   77,
  KEY_KP_Plus     :/* + (Plus)              0x4e  */   78,
  KEY_KP_1        :/* 1           End       0x4f  */   79,
  KEY_KP_2        :/* 2           Down      0x50  */   80,
  KEY_KP_3        :/* 3           PgDown    0x51  */   81,
  KEY_KP_0        :/* 0           Insert    0x52  */   82,
  KEY_KP_Decimal  :/* . (Decimal) Delete    0x53  */   83,
  KEY_SysRequest  :/* SysRequest            0x54  */   84,
                   /* NOTUSED               0x55  */
  KEY_Less        :/* < (Less)   >(Greater) 0x56  */   86,
  KEY_F11         :/* F11                   0x57  */   87,
  KEY_F12         :/* F12                   0x58  */   88,

  KEY_Prefix0     :/* special               0x60  */   96,
  KEY_Prefix1     :/* specail               0x61  */   97,
};

const keyCodeMap = {
  "a": 65, "A": 65, "b": 66, "B": 66, "c": 67, "C": 67, "d": 68, "D": 68,
  "e": 69, "E": 69, "f": 70, "F": 70, "g": 71, "G": 71, "h": 72, "H": 72,
  "i": 73, "I": 73, "j": 74, "J": 74, "k": 75, "K": 75, "l": 76, "L": 76,
  "m": 77, "M": 77, "n": 78, "N": 78, "o": 79, "O": 79, "p": 80, "P": 80,
  "q": 81, "Q": 81, "r": 82, "R": 82, "s": 83, "S": 83, "t": 84, "T": 84,
  "u": 85, "U": 85, "v": 86, "V": 86, "w": 87, "W": 87, "x": 88, "X": 88,
  "y": 89, "Y": 89, "z": 90, "Z": 90,
  "0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54,
  "7": 55, "8": 56, "9": 57,
  "!": 49, "@": 50, "#": 51, "$": 52, "%": 53, "^": 54, "&": 55, "*": 56, "(": 57, ")": 48,
  "Enter": 13, "Escape": 27, " ": 32, "Tab": 9, "Backspace": 8,
  "Shift": 16, "Control": 17, "Alt": 18, "CapsLock": 20,
  "ArrowLeft": 37, "ArrowUp": 38, "ArrowRight": 39, "ArrowDown": 40,
  "F1": 112, "F2": 113, "F3": 114, "F4": 115, "F5": 116, "F6": 117,
  "F7": 118, "F8": 119, "F9": 120, "F10": 121, "F11": 122, "F12": 123,
  ";": 59, ":": 59, "=": 187, "+": 187, ",": 188, "<": 188, "-": 189, "_": 189, ".": 190, ">": 190, 
  "/": 191, "?": 191, "`": 192, "~": 192, "[": 219, "{": 219, "\\": 220, "|": 220, "]": 221, 
  "}": 221, "'": 222, "\"": 222, "_": 173, "+": 61,
  "А": 70, "а": 70, "Б": 188, "б": 188, "В": 68, "в": 68, "Г": 71, "г": 71,
  "Д": 76, "д": 76, "Е": 85, "е": 85, "Ё": 192, "ё": 192, "Ж": 186, "ж": 186,
  "З": 80, "з": 80, "И": 83, "и": 83, "Й": 81, "й": 81, "К": 82, "к": 82,
  "Л": 75, "л": 75, "М": 86, "м": 86, "Н": 89, "н": 89, "О": 74, "о": 74,
  "П": 71, "п": 71, "Р": 75, "р": 75, "С": 73, "с": 73, "Т": 77, "т": 77,
  "У": 69, "у": 69, "Ф": 65, "ф": 65, "Х": 219, "х": 219, "Ц": 87, "ц": 87,
  "Ч": 88, "ч": 88, "Ш": 73, "ш": 73, "Щ": 79, "щ": 79, "Ъ": 221, "ъ": 221,
  "Ы": 83, "ы": 83, "Ь": 77, "ь": 77, "Э": 81, "э": 81, "Ю": 186, "ю": 186,
  "Я": 90, "я": 90
};

export {
  KeyNames,
  keyCodeMap,
};
