
let mnumonic_type = [
    "NOP","LXI","STAX","INX","INR","DCR","MVI","RLC","DAD",
    "LDAX","DCX","RRC","RAL","RAR","RIM","SHLD","DAA","LHLD",
    "CMA","SIM","STA","STC","LDA","CMC","MOV","HLT","ADD",
    "ADC","SUB","SBB","ANA","XRA","ORA","CMP","RNZ","POP",
    "JNZ","JMP","CNZ","PUSH","ADI","RZ","RET","JZ","CZ","CALL",
    "ACI","RNC","JNC","OUT","CNC","PUSH","SUI","RC","JC","IN",
    "CC","SBI","RPO","JPO","XTHL","CPO","PUSH","ANI","RPE","PCHL",
    "JPE","XCHG","CPE","XRI","RP","JP", "DI","CP","PUSH","ORI",
    "RM","SPHL","JM","EI","CM","CPI","RST"
];

let mnumonic_hm = new Map();
for(let mem of mnumonic_type) {
    mnumonic_hm.set(mem, 1);
}

const mnumonic_hexcode = {
    "NOP"   :0x00, "LXI_B" :0x01, "STAX_B":0x02, "INX_B" :0x03,
    "INR_B" :0x04, "DCR_B" :0x05, "MVI_B" :0x06, "RLC":0x07,
    "DAD_B" :0x09, "LDAX_B":0x0A, "DCX_B" :0x0B, "INR_C" :0x0C,
    "DCR_C" :0x0D, "MVI_C" :0x0E, "RRC"   :0x0F, "LXI_D":0x11,
    "STAX_D":0x12, "INX_D" :0x13, "INR_D" :0x14, "DCR_D" :0x15,
    "MVI_D" :0x16, "RAL"   :0x17, "DAD_D" :0x19, "LDAX_D":0x1A,
    "DCX_D" :0x1B, "INR_E" :0x1C, "DCR_E" :0x1D, "MVI_E" :0x1E,
    "RAR"  :0x1F, "RIM"  :0x20, "LXI_H":0x21, "SHLD" :0x22,
    "INX_H":0x23, "INR_H":0x24, "DCR_H":0x25, "MVI_H":0x26,
    "DAA"  :0x27, "DAD_H":0x29, "LHLD" :0x2A, "DCX_H":0x2B,
    "INR_L":0x2C, "DCR_L":0x2D, "MVI_L":0x2E, "CMA":0x2F,
    "SIM":0x30, "LXI_SP":0x31, "STA"  :0x32, "INX_SP":0x33,
    "INR_M":0x34, "DCR_M":0x35, "MVI_M":0x36, "STC"  :0x37,
    "DAD_SP":0x39, "LDA"  :0x3A, "DCX_SP":0x3B, "INR_A":0x3C,
    "DCR_A":0x3D, "MVI_A":0x3E, "CMC"  :0x3F, "MOV_B_B"  :0x40,
    "MOV_B_C"  :0x41, "MOV_B_D"  :0x42, "MOV_B_E"  :0x43, "MOV_B_H"  :0x44,
    "MOV_B_L"  :0x45, "MOV_B_M"  :0x46, "MOV_B_A"  :0x47, "MOV_C_B"  :0x48,
    "MOV_C_C"  :0x49, "MOV_C_D"  :0x4A, "MOV_C_E"  :0x4B, "MOV_C_H"  :0x4C,
    "MOV_C_L"  :0x4D, "MOV_C_M"  :0x4E, "MOV_C_A"  :0x4F, "MOV_D_B"  :0x50,
    "MOV_D_C"  :0x51, "MOV_D_D"  :0x52, "MOV_D_E"  :0x53, "MOV_D_H"  :0x54,
    "MOV_D_L"  :0x55, "MOV_D_M"  :0x56, "MOV_D_A"  :0x57, "MOV_E_B"  :0x58,
    "MOV_E_C"  :0x59, "MOV_E_D"  :0x5A, "MOV_E_E"  :0x5B, "MOV_E_H"  :0x5C,
    "MOV_E_L"  :0x5D, "MOV_E_M"  :0x5E, "MOV_E_A"  :0x5F, "MOV_H_B"  :0x60,
    "MOV_H_C"  :0x61, "MOV_H_D"  :0x62, "MOV_H_E"  :0x63, "MOV_H_H"  :0x64,
    "MOV_H_L"  :0x65, "MOV_H_M"  :0x66, "MOV_H_A"  :0x67, "MOV_L_B"  :0x68,
    "MOV_L_C"  :0x69, "MOV_L_D"  :0x6A, "MOV_L_E"  :0x6B, "MOV_L_H"  :0x6C,
    "MOV_L_L"  :0x6D, "MOV_L_M"  :0x6E, "MOV_L_A"  :0x6F, "MOV_M_B"  :0x70,
    "MOV_M_C"  :0x71, "MOV_M_D"  :0x72, "MOV_M_E"  :0x73, "MOV_M_H"  :0x74,
    "MOV_M_L"  :0x75, "HLT"  :0x76, "MOV_M_A"  :0x77, "MOV_A_B"  :0x78,
    "MOV_A_C"  :0x79, "MOV_A_D"  :0x7A, "MOV_A_E"  :0x7B, "MOV_A_H"  :0x7C,
    "MOV_A_L"  :0x7D, "MOV_A_M"  :0x7E, "MOV_A_A"  :0x7F, "ADD_B" :0x80,
    "ADD_C" :0x81, "ADD_D" :0x82, "ADD_E" :0x83, "ADD_H" :0x84,
    "ADD_L" :0x85, "ADD_M" :0x86, "ADD_A" :0x87, "ADC_B" :0x88,
    "ADC_C" :0x89, "ADC_D" :0x8A, "ADC_E" :0x8B, "ADC_H" :0x8C,
    "ADC_L" :0x8D, "ADC_M" :0x8E, "ADC_A" :0x8F, "SUB_B" :0x90,
    "SUB_C" :0x91, "SUB_D" :0x92, "SUB_E" :0x93, "SUB_H" :0x94,
    "SUB_L" :0x95, "SUB_M" :0x96, "SUB_A" :0x97, "SBB_B" :0x98,
    "SBB_C" :0x99, "SBB_D" :0x9A, "SBB_E" :0x9B, "SBB_H" :0x9C,
    "SBB_L" :0x9D, "SBB_M" :0x9E, "SBB_A" :0x9F, "ANA_B" :0xA0,
    "ANA_C" :0xA1, "ANA_D" :0xA2, "ANA_E" :0xA3, "ANA_H" :0xA4,
    "ANA_L" :0xA5, "ANA_M" :0xA6, "ANA_A" :0xA7, "XRA_B" :0xA8,
    "XRA_C" :0xA9, "XRA_D" :0xAA, "XRA_E" :0xAB, "XRA_H" :0xAC,
    "XRA_L" :0xAD, "XRA_M" :0xAE, "XRA_A" :0xAF, "ORA_B" :0xB0,
    "ORA_C" :0xB1, "ORA_D" :0xB2, "ORA_E" :0xB3, "ORA_H" :0xB4,
    "ORA_L" :0xB5, "ORA_M" :0xB6, "ORA_A" :0xB7, "CMP_B" :0xB8,
    "CMP_C" :0xB9, "CMP_D" :0xBA, "CMP_E" :0xBB, "CMP_H" :0xBC,
    "CMP_L" :0xBD, "CMP_M" :0xBE, "CMP_A" :0xBF, "RNZ":0xC0,
    "POP_B" :0xC1, "JNZ"  :0xC2, "JMP"  :0xC3, "CNZ"  :0xC4,
    "PUSH_B":0xC5, "ADI":0xC6, "RST_0" :0xC7, "RZ" :0xC8,
    "RET":0xC9, "JZ":0xCA, "CZ":0xCC, "CALL"  :0xCD,
    "ACI":0xCE, "RST_1" :0xCF, "RNC":0xD0, "POP_D" :0xD1,
    "JNC":0xD2, "OUT":0xD3, "CNC":0xD4, "PUSH_D":0xD5,
    "SUI":0xD6, "RST_2" :0xD7, "RC" :0xD8, "JC" :0xDA,
    "IN" :0xDB, "CC" :0xDC, "SBI":0xDE, "RST_3" :0xDF,
    "RPO":0xE0, "POP_H" :0xE1, "JPO":0xE2, "XTHL"  :0xE3,
    "CPO":0xE4, "PUSH_H":0xE5, "ANI":0xE6, "RST_4" :0xE7,
    "RPE":0xE8, "PCHL"  :0xE9, "JPE"  :0xEA, "XCHG"  :0xEB,
    "CPE":0xEC, "XRI":0xEE, "RST_5" :0xEF, "RP" :0xF0,
    "POP_PSW"  :0xF1, "JP" :0xF2, "DI" :0xF3, "CP" :0xF4,
    "PUSH_PSW" :0xF5, "ORI":0xF6, "RST_6" :0xF7, "RM" :0xF8,
    "SPHL"  :0xF9, "JM" :0xFA, "EI" :0xFB, "CM" :0xFC,
    "CPI":0xFE, "RST_7" :0xFF
};

const is_Number = (ch) => {
    let zero = '0'.charCodeAt(0);
    let nine = '9'.charCodeAt(0);
    let ch_ascii = ch.charCodeAt(0);
    if(zero <= ch_ascii && ch_ascii <= nine) return true;
    return false;
}

const is_Alphabet = (ch) => {
    let a = 'a'.charCodeAt(0);
    let z = 'z'.charCodeAt(0);
    let cap_a = 'A'.charCodeAt(0);
    let cap_z = 'Z'.charCodeAt(0);
    let ch_ascii = ch.charCodeAt(0);
    if((a <= ch_ascii && ch_ascii <= z) || (cap_a <= ch_ascii && ch_ascii <= cap_z)) return true;
    return false;
}

const is_Alphanum = (ch) => {
    return is_Alphabet(ch) || is_Number(ch);
}

const is_Hex_Str = (str) => {
    if(str.charAt(str.length - 1).toUpperCase() !== "H") return false;
    let hex_letters = ["A", "B", "C", "D", "E", "F"];
    for(let i = 0; i < (str.length - 1); ++i) {
        let is_num = is_Number(str.charAt(i));
        if(!is_num) {
            let is_hex_letter = false;
            for(let j = 0; j < hex_letters.length; ++j) {
                if(str.charAt(i).toUpperCase() === hex_letters[j]) {
                    is_hex_letter = true;
                }
            }
            if(!is_hex_letter) return false;
        }
    }
    return true;
};

class Tokenizer {
    constructor(text_str) {
        this.text_str = text_str + "\n";
        this.idx = 0;
        this.lines = 0;  // row
        this.offset = 0; // col
    }

    peek_Next_Char() {
        if(this.idx < this.text_str.length) { 
            return this.text_str.charAt(this.idx);
        } else return null;
    }

    consume_Next_Char() {
        this.offset++;
        if(this.peek_Next_Char() === "\n") {
            this.lines++;
            this.offset = 0;
        }
        if(this.idx < this.text_str.length) {
            this.idx++;
        }
    }

    next_Char() {
        let ch = this.peek_Next_Char();
        this.consume_Next_Char();
        return ch;
    }

    skip_Unnecessary() {
        while(true) {
            let ch = this.peek_Next_Char();
            if(new RegExp("^(\\n|\\s|\\t)$").test(ch)) {
                this.consume_Next_Char();
            } else {
                break;
            }
        }
    }

    next_Token() {
        this.skip_Unnecessary();
        while(true) {
            if(new RegExp("^(;|#)$").test(this.peek_Next_Char())) {
                while(this.peek_Next_Char() !== '\n') {
                    this.consume_Next_Char();
                }
                this.consume_Next_Char();
            } else {
                break;
            }
        }
        this.skip_Unnecessary();
        let token = "";
        if(this.peek_Next_Char() === ',') {
            this.consume_Next_Char();
            return { str: ',', row: this.lines, col: (this.offset - 1) }; // token, row, col
        }
        while(true) {
            let ch = this.peek_Next_Char();
            if(new RegExp("^(\\s|\\t|\\n|,)$").test(ch) || ch === null) {
                break;
            }
            token += ch;
            this.consume_Next_Char();
        }
        return { str: token, row: this.lines, col: (this.offset - token.length) }; // token, row, col
    }

}

const is_Mnumonic_Str = (str) => {
    if(mnumonic_hm.get(str.toUpperCase()) === 1) {
        return true;
    }
    return false;
};

const is_Reg_Str = (ch) => {
    let regs = ["A", "B", "C", "D", "E", "H", "L", "M"];
    for(let r of regs) {
        if(r === ch.toUpperCase()) return true;
    }
    return false;
};

const TOKEN_NONE      = iota++;
const TOKEN_MNEMONIC  = iota++;
const TOKEN_NUMBER    = iota++;
const TOKEN_REGISTER  = iota++;
const TOKEN_LABEL_DEF = iota++;
const TOKEN_LABEL_USE = iota++;
const TOKEN_DIRECTIVE = iota++;
const TOKEN_COMMA     = iota++;

const DIRECTIVE_ORG = iota++;
const DIRECTIVE_DB  = iota++;

class Token {
    constructor(t_type, t_data) {
        this.token_type = t_type;
        this.token_data = t_data;
    }
}

const tokenize = () => {
    let tk = new Tokenizer(document.getElementById("code_area").value);
    let tokens = [];
    while(true) {
        let tk_info = tk.next_Token();
        let token = tk_info.str;
        if(tk_info === null) {
            alert("Tokenization error...!");
            return null; // error in tokenization
        }
        if(token === "") break; // no more tokens 
        // process tk_info
        if(token.charAt(0) === '.') { // directive
            token = token.toUpperCase();
            if(token === ".ORG") {
                tokens.push(new Token(TOKEN_DIRECTIVE, DIRECTIVE_ORG));
            } else if(token === ".DB") {
                tokens.push(new Token(TOKEN_DIRECTIVE, DIRECTIVE_DB));
            } else {
                alert("Invalid Directive at row: " + tk_info.row + " col: " + tk_info.col);
                return null;
            }
        } 
        else if(token.charAt(token.length - 1) === ":") {
            tokens.push(new Token(TOKEN_LABEL_DEF, token.slice(0, token.length - 1)));
        } 
        else if(is_Hex_Str(token) && token.length > 1) {
            tokens.push(new Token(TOKEN_NUMBER, parseInt(token.slice(0, token.length - 1), 16)));
        }
        else if(is_Reg_Str(token)) {
            tokens.push(new Token(TOKEN_REGISTER, token.toUpperCase()));
        }
        else if(is_Mnumonic_Str(token)) {
            tokens.push(new Token(TOKEN_MNEMONIC, token.toUpperCase()));
        }
        else if(token === ',') {
            tokens.push(new Token(TOKEN_COMMA, null));
        }
        else if(is_Alphabet(token.charAt(0))) { // LABEL CHECK
            tokens.push(new Token(TOKEN_LABEL_USE, token));
        } 
        else {
            alert("Invalid Token at row: " + tk_info.row + " col: " + tk_info.col);
            return null;
        }
    }
    return tokens;
}

const lexical_analysis = () => {
    
}

