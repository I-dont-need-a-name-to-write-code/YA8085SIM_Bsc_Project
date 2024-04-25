
let iota = 0;

// REGISTER INDEXES
const REG_A   = 0;
const REG_B   = 1;
const REG_C   = 2;
const REG_D   = 3;
const REG_E   = 4;
const REG_H   = 5;
const REG_L   = 6;
const REG_SPH = 7;
const REG_SPL = 8;
const REG_SP  = REG_SPH;
const REG_PCH = 9;
const REG_PCL = 10;
const REG_PC  = REG_PCH;

// FLAG INDEXES
const FLAG_S  = 0;
const FLAG_Z  = 1;
const FLAG_AC = 2;
const FLAG_P  = 3;
const FLAG_CY = 4;

// FLAG MASKS
const FLAG_S_MASK  = (1 << 7);
const FLAG_Z_MASK  = (1 << 6);
const FLAG_AC_MASK = (1 << 4);
const FLAG_P_MASK  = (1 << 2);
const FLAG_CY_MASK = (1 << 0);

// REGISTER CODES
const REG_A_CODE = 0b111;
const REG_B_CODE = 0b000;
const REG_C_CODE = 0b001;
const REG_D_CODE = 0b010;
const REG_M_CODE = 0b110;
const REG_E_CODE = 0b011;
const REG_H_CODE = 0b100;
const REG_L_CODE = 0b101;

const RP_BC_CODE = 0b00;
const RP_DE_CODE = 0b01;
const RP_HL_CODE = 0b10;
const RP_SP_CODE = 0b11;

const REG_CODE_TO_IDX = [
    REG_B, REG_C, REG_D, REG_E, REG_H, REG_L, 0b000, REG_A
];

const REG_IDX_TO_CODE = [
    REG_A_CODE, REG_B_CODE, REG_C_CODE, REG_D_CODE,
    REG_E_CODE, REG_H_CODE, REG_L_CODE
];

const RP_CODE_TO_IDX = [
    REG_B, REG_D, REG_H, REG_SP
];

// ENUMS
const INSTR_TY_ADD = iota++;
const INSTR_TY_SUB = iota++;
0
1

const MSG_TY_DFLT = iota++;
const MSG_TY_EXEC = iota++;

// CONSTANTS
const MEMORY_SIZE = 65536;

const make_Word = (byte_h, byte_l) => {
    return ((byte_h << 8) | byte_l);
};

const left_Pad = (str, ch, total_length) => {
    let new_str = str;
    let add_count = total_length - str.length;
    while(add_count > 0) {
        new_str = ch + new_str;
        add_count -= 1;
    }
    return new_str;
};

const to_Hex2_Str = (num) => {
    return "hex(" + left_Pad(num.toString(16), '0', 2) + ")";
};

const to_Bin8_Str = (num) => {
    return "bin(" + left_Pad((num >>> 0).toString(2), '0', 8) + ")";
};

const to_Hex4_Str = (num) => {
    return "hex(" + left_Pad(num.toString(16), '0', 4) + ")";
};

const to_Bin16_Str = (num) => {
    return "bin(" + left_Pad((num >>> 0).toString(2), '0', 16) + ")";
};

class CPU_Context {
    constructor() {
        // A, B, C, D, E, H, L, SPh, SPl, PCh, PCl
        this.register = new Uint8Array(11).fill(0);
        // S, Z, AC, P, CY
        this.flag = new Uint8Array(5).fill(0);
        this.memory = new Uint8Array(MEMORY_SIZE).fill(0);
    }

    log() {
        let reg_name = ["A", "B", "C", "D", "E", "H", "L"];
        let str = "#) Registers :-\n";
        let x;
        for(let i = 0; i < reg_name.length; ++i) {
            x = this.register[i];
            str += "\t";
            str += reg_name[i] + "  => [ uint(" + x + ")";
            str += " | int(" + (x > (Math.pow(2, 7) - 1) ? (x - Math.pow(2, 8)) : x) + ")";
            str += " | " + to_Hex2_Str(x);
            str += " | " + to_Bin8_Str(x);
            str += " ]\n";
        }
        
        x = this.get_RP(REG_PC);
        str += "\t";
        str += "PC => [ uint(" + x + ")";
        str += " | int(" + (x > (Math.pow(2, 15) - 1) ? (x - Math.pow(2, 16)) : x) + ")";
        str += " | " + to_Hex4_Str(x);
        str += " | " + to_Bin16_Str(x) + "]\n";
        
        x = this.get_RP(REG_SP);
        str += "\t";
        str += "SP => [ uint(" + x + ")";
        str += " | int(" + (x > (Math.pow(2, 15) - 1) ? (x - Math.pow(2, 16)) : x) + ")";
        str += " | " + to_Hex4_Str(x);
        str += " | " + to_Bin16_Str(x) + "]\n";
    
        let flag_name = ["S", "Z", "AC", "P", "CY"];
        str += "#) Flags := [ ";
        for(let i = 0; i < this.flag.length; ++i) {
            if(i > 0) str += "| ";
            str += flag_name[i] + "(" + this.flag[i] + ") ";
        }
        str += "]\n";

        console.log(str);
    }
    
    get_Reg(reg_idx) {
        return this.register[reg_idx];
    }

    set_Reg(reg_idx, value) {
        this.register[reg_idx] = value;
    }

    get_RP(rp_idx) {
        let rp = this.register[rp_idx];
        rp = (rp << 8) | this.register[rp_idx + 1];
        return rp;
    }

    set_RP(rp_idx, value) {
        this.register[rp_idx + 1] = value & 0xFF;
        this.register[rp_idx] = (value >> 8) & 0xFF;
    }

    get_HL() {
        return this.get_RP(REG_H);
    }

    set_HL(value) {
        this.set_RP(REG_H, value);
    }

    get_BC() {
        return this.get_RP(REG_B);
    }

    set_BC(value) {
        this.set_RP(REG_B, value);
    }

    get_DE() {
        return this.get_RP(REG_D);
    }

    set_DE(value) {
        this.set_RP(REG_D, value);
    }

    get_PC() {
        return this.get_RP(REG_PC);
    }

    set_PC(value) {
        this.set_RP(REG_PC, value);
    }

    get_SP() {
        return this.get_RP(REG_SP);
    }

    set_SP(value) {
        this.set_RP(REG_SP, value);
    }

    get_Flag(flag_idx) {
        return this.flag[flag_idx];
    }

    set_Flag(flag_idx, value) {
        this.flag[flag_idx] = value;
    }
    
    get_Mem(addr) {
        return this.memory[addr];
    }

    set_Mem(addr, value) {
        this.memory[addr] = value;
    }
    
    reset() {
        this.register.fill(0);
        this.flag.fill(0);
    }

    copy_To_Mem(dst_addr, src_array) {
        if(dst_addr + src_array.length >= MEMORY_SIZE) return false;
        for(let i = 0; i < src_array.length; ++i) {
            this.memory[i + dst_addr] = src_array[i];
        }
        return true;
    }

    get_Mem_Chunk(addr, len) {
        if((addr + len) > MEMORY_SIZE) {
            len = MEMORY_SIZE - addr;
        };
        let mem_portion = new Uint8Array(len);
        for(let i = 0; i < len; ++i) {
            mem_portion[i] = (this.memory[addr + i]);
        }
        return mem_portion;
    }

    log_Mem_Chunk(addr, len) {
        if((addr + len) > MEMORY_SIZE) {
            len = MEMORY_SIZE - addr;
        };
        let str = "";
        for(let i = addr; i < (addr + len); ++i) {
            str += to_Hex4_Str(i) + " -> " + to_Hex2_Str(this.memory[i]) + "\n";
        }
        console.log(str);
    }

    // Instruction Helpers
    
    fetch_Byte() {
        let byte = this.memory[this.get_PC()];
        this.inx_RP(REG_PC);
        return byte;
    }

    fetch_Word() {
        let byte_l = this.fetch_Byte();
        let byte_h = this.fetch_Byte();
        return make_Word(byte_h, byte_l);
    }

    move(dst_reg_idx, src_reg_idx) {
        this.register[dst_reg_idx] = this.register[src_reg_idx];
    }

    move_Mem_To_Reg(dst_reg_idx, src_addr) {
        this.register[dst_reg_idx] = this.memory[src_addr];
    }

    move_Reg_To_Mem(dst_addr, src_reg_idx) {
        this.memory[dst_addr] = this.register[src_reg_idx];
    }

    move_Mem_To_Reg_Indir(dst_reg_idx, rp_idx) {
        let addr = this.get_RP(rp_idx);
        this.register[dst_reg_idx] = this.memory[addr];
    }

    move_Reg_To_Mem_Indir(src_reg_idx, rp_idx) {
        let addr = this.get_RP(rp_idx);
        this.memory[addr] = this.register[src_reg_idx];
    }

    inx_RP(rp_idx) {
        this.set_RP(rp_idx, this.get_RP(rp_idx) + 1);
    }

    dcx_RP(rp_idx) {
        this.set_RP(rp_idx, this.get_RP(rp_idx) - 1);
    }

    handle_Status_Flags_Ex_AC_CY(new_val) {
        let reg = new_val;
        // keep CY and AC as it is 
        let cy = this.get_Flag(FLAG_CY);
        let ac = this.get_Flag(FLAG_AC);
        this.flag.fill(0);
        this.set_Flag(FLAG_CY, cy);
        this.set_Flag(FLAG_AC, ac);
        // sign flag
        if((reg & 0x80) > 0) this.set_Flag(FLAG_S, 1);
        // zero flag
        if(reg === 0) this.set_Flag(FLAG_Z, 1);
        // parity flag
        let temp = reg;
        let even = 1;
        while(temp !== 0) {
            even ^= (temp & 1);
            temp >>= 1;
        }
        this.set_Flag(FLAG_P, even);
    }

    handle_AC_CY_Flag(new_val, old_val, instr_type) {
        // auxilliary carry flag
        let old_ln = old_val & 0x0F;
        let new_ln = new_val & 0x0F;
        let cond_ac = [ instr_type === INSTR_TY_ADD && new_ln < old_ln, 
                        instr_type === INSTR_TY_SUB && new_ln > old_ln ];
        let ac = 0;
        cond_ac.forEach(a => ac |= Number(a));
        this.set_Flag(FLAG_AC, ac);

        // carry flag
        let cond_cy = [ instr_type === INSTR_TY_ADD && new_val < old_val, 
                        instr_type === INSTR_TY_SUB && new_val > old_val ];
        let cy = 0;
        cond_cy.forEach(c => cy |= Number(c));
        this.set_Flag(FLAG_CY, cy);
    }

    handle_Status_Flags(new_val, old_val, instr_type) {
        this.handle_Status_Flags_Ex_AC_CY(new_val);
        this.handle_AC_CY_Flag(new_val, old_val, instr_type);
    }
    
    add(value) {
        let old_A = this.register[REG_A];
        this.register[REG_A] += value; 
        this.handle_Status_Flags(this.register[REG_A], old_A, INSTR_TY_ADD);
    }
    
    add_Including_CY(value) {
        let old_A = this.register[REG_A];
        this.register[REG_A] += value; 
        this.register[REG_A] += this.flag[FLAG_CY]; 
        this.handle_Status_Flags(this.register[REG_A], old_A, INSTR_TY_ADD);
    }

    add_Reg(reg_idx) {
        this.add(this.register[reg_idx]);
    }
    
    add_Reg_Including_CY(reg_idx) {
        this.add_Including_CY(this.register[reg_idx]);
    }
    
    add_Mem() {
        this.add(this.memory[this.get_HL()]); 
    }
    
    add_Mem_Including_CY() {
        this.add_Including_CY(this.memory[this.get_HL()]); 
    }
    
    sub(value) {
        let old_A = this.register[REG_A];
        this.register[REG_A] -= value; 
        this.handle_Status_Flags(this.register[REG_A], old_A, INSTR_TY_SUB);
    }
    
    sub_Including_CY(value) {
        let old_A = this.register[REG_A];
        this.register[REG_A] -= value; 
        this.register[REG_A] -= this.flag[FLAG_CY];
        this.handle_Status_Flags(this.register[REG_A], old_A, INSTR_TY_SUB);
    }

    sub_Reg(reg_idx) {
        this.sub(this.register[reg_idx]);
    }
    
    sub_Reg_Including_CY(reg_idx) {
        this.sub_Including_CY(this.register[reg_idx]);
    }

    sub_Mem() {
        this.sub(this.memory[this.get_HL()]);
    }
    
    sub_Mem_Including_CY() {
        this.sub_Including_CY(this.memory[this.get_HL()]);
    }

    and(value) {
        this.register[REG_A] &= value;
        this.handle_Status_Flags_Ex_AC_CY(this.register[REG_A]);
        this.set_Flag(FLAG_AC, 1);
        this.set_Flag(FLAG_CY, 0);
    }
    
    and_Reg(reg_idx) {
        this.and(this.register[reg_idx]);
    }
    
    and_Mem() {
        this.and(this.memory[this.get_HL()]);
    }
    
    xor(value) {
        this.register[REG_A] ^= value;
        this.handle_Status_Flags_Ex_AC_CY(this.register[REG_A]);
        this.set_Flag(FLAG_AC, 0);
        this.set_Flag(FLAG_CY, 0);
    }
    
    xor_Reg(reg_idx) {
        this.xor(this.register[reg_idx]);
    }
    
    xor_Mem() {
        this.xor(this.memory[this.get_HL()]);
    }

    or(value) {
        this.register[REG_A] |= value;
        this.handle_Status_Flags_Ex_AC_CY(this.register[REG_A]);
        this.set_Flag(FLAG_AC, 0);
        this.set_Flag(FLAG_CY, 0);
    }
    
    or_Reg(reg_idx) {
        this.or(this.register[reg_idx]);
    }
    
    or_Mem() {
        this.or(this.memory[this.get_HL()]);
    }

    add_Double(rp_idx) {
        let old_HL = this.get_HL();
        this.set_HL(old_HL + this.get_RP(rp_idx));
        let cy = 0;
        if(this.get_HL() < old_HL) cy = 1;
        this.set_Flag(FLAG_CY, cy);
    }
    
    cmp_And_Set_Flags(val1, val2) {
        let diff = (val1 - val2);
        let z  = 0;
        let cy = 0;
        if(diff === 0) {
            cy = 0;
            z  = 1;
        } else if(diff < 0) {
            cy = 1;
            z  = 0;
        }
        this.set_Flag(FLAG_Z, z);
        this.set_Flag(FLAG_CY, cy);
    }

    cmp_Reg(reg_idx) {
        let val1 = this.get_Reg(REG_A);
        let val2 = this.get_Reg(reg_idx);
        this.cmp_And_Set_Flags(val1, val2);
    }

    cmp_Mem() {
        let val1 = this.get_Reg(REG_A);
        let val2 = this.get_Mem(this.get_HL());
        this.cmp_And_Set_Flags(val1, val2);
    }

    rotate_Left_CY() {
        let ms_bit = (this.get_Reg(REG_A) & 0b10000000) >> 7;
        this.set_Flag(FLAG_CY, ms_bit);
        this.register[REG_A] <<= 1;
        this.register[REG_A] |= ms_bit;
    }

    rotate_Right_CY() {
        let ls_bit = this.get_Reg(REG_A) & 0b00000001;
        this.set_Flag(FLAG_CY, ls_bit);
        this.register[REG_A] >>= 1;
        this.register[REG_A] |= (ls_bit << 7);
    }

    rotate_Left_Through_CY() {
        let ms_bit = (this.get_Reg(REG_A) & 0b10000000) >> 7;
        this.register[REG_A] <<= 1;
        this.register[REG_A] |= this.get_Flag(FLAG_CY);
        this.set_Flag(FLAG_CY, ms_bit);
    }

    rotate_Right_Through_CY() {
        let ls_bit = this.get_Reg(REG_A) & 0b00000001;
        this.register[REG_A] >>= 1;
        this.register[REG_A] |= (this.get_Flag(FLAG_CY) << 7);
        this.set_Flag(FLAG_CY, ls_bit);

    }

    // [ S  Z  X  AC  X  P  X  CY ]
    get_Flag_Reg() {
        let byte = this.flag[FLAG_CY];
        byte |= (this.flag[FLAG_P]  << 2);
        byte |= (this.flag[FLAG_AC] << 4);
        byte |= (this.flag[FLAG_Z]  << 6);
        byte |= (this.flag[FLAG_S]  << 7);
        return byte;
    }

    set_Flag_Reg(byte) {
        this.flag.fill(0);
        if((byte & FLAG_S_MASK) > 0) {
            this.set_Flag(FLAG_S, 1);
        }
        if((byte & FLAG_Z_MASK) > 0) {
            this.set_Flag(FLAG_Z, 1);
        }
        if((byte & FLAG_AC_MASK) > 0) {
            this.set_Flag(FLAG_AC, 1);
        }
        if((byte & FLAG_P_MASK) > 0) {
            this.set_Flag(FLAG_P, 1);
        }
        if((byte & FLAG_CY_MASK) > 0) {
            this.set_Flag(FLAG_CY, 1);
        }
    }

    push_RP(rp_idx) {
        this.dcx_RP(REG_SP);
        this.memory[this.get_SP()] = this.register[rp_idx];
        this.dcx_RP(REG_SP);
        this.memory[this.get_SP()] = this.register[rp_idx + 1];
    }

    push_PSW() {
        // PSW => ( PSW_H, PSW_L ) => ( Accumulator, Flag Register );
        this.dcx_RP(REG_SP);
        this.memory[this.get_SP()] = this.register[REG_A];
        this.dcx_RP(REG_SP);
        this.memory[this.get_SP()] = this.get_Flag_Reg();
    }

    pop_RP(rp_idx) {
        this.register[rp_idx + 1] = this.memory[this.get_SP()];
        this.inx_RP(REG_SP);
        this.register[rp_idx] = this.memory[this.get_SP()];
        this.inx_RP(REG_SP);
    }

    pop_PSW() {
        // PSW => ( PSW_H, PSW_L ) => ( Accumulator, Flag Register );
        this.set_Flag_Reg(this.memory[this.get_SP()]);
        this.inx_RP(REG_SP);
        this.register[REG_A] = this.memory[this.get_SP()];
        this.inx_RP(REG_SP);
    }

}

const copy_CPU_Context = (to_cpu, from_cpu) => {
    for(let i = 0; i < to_cpu.register.length; ++i) {
        to_cpu.register[i] = from_cpu.register[i];
    }
    for(let i = 0; i < to_cpu.flag.length; ++i) {
        to_cpu.flag[i] = from_cpu.flag[i];
    }
    for(let i = 0; i < to_cpu.memory.length; ++i) {
        to_cpu.memory[i] = from_cpu.memory[i];
    }
};

const handle_instruction = (cpu, instr) => {
    switch(instr) {
        case INSTR_LDA: {
            let addr = cpu.fetch_Word();
            cpu.move_Mem_To_Reg(REG_A, addr);
            break;
        }
        case INSTR_STA: {
            let addr = cpu.fetch_Word();
            cpu.move_Reg_To_Mem(addr, REG_A);
            break;
        }
        case INSTR_INX_B:
        case INSTR_INX_D:
        case INSTR_INX_H:
        case INSTR_INX_SP: {
            let mask = 0b00110000;
            let rp_idx = RP_CODE_TO_IDX[(mask & instr) >> 4];
            cpu.inx_RP(rp_idx);
            break;
        }
        case INSTR_DCX_B:
        case INSTR_DCX_D:
        case INSTR_DCX_H:
        case INSTR_DCX_SP: {
            let mask = 0b00110000;
            let rp_idx = RP_CODE_TO_IDX[(mask & instr) >> 4];
            cpu.dcx_RP(rp_idx);
            break;
        }
        case INSTR_INR_A:
        case INSTR_INR_B:
        case INSTR_INR_C:
        case INSTR_INR_D:
        case INSTR_INR_E:
        case INSTR_INR_H:
        case INSTR_INR_L: {
            let mask = 0b00111000;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr) >> 3];
            let old_val = cpu.get_Reg(reg_idx);
            cpu.register[reg_idx] += 1;
            cpu.handle_Status_Flags(cpu.get_Reg(reg_idx), old_val, INSTR_TY_ADD);
            break;
        }
        case INSTR_INR_M: {
            let old_val = cpu.get_Mem(cpu.get_HL());
            cpu.memory[cpu.get_HL()] += 1;
            cpu.handle_Status_Flags(cpu.memory[cpu.get_HL()], old_val, INSTR_TY_ADD);
            break;
        }
        case INSTR_DCR_A:
        case INSTR_DCR_B:
        case INSTR_DCR_C:
        case INSTR_DCR_D:
        case INSTR_DCR_E:
        case INSTR_DCR_H:
        case INSTR_DCR_L: {
            let mask = 0b00111000;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr) >> 3];
            let old_val = cpu.get_Reg(reg_idx);
            cpu.register[reg_idx] -= 1;
            cpu.handle_Status_Flags(cpu.get_Reg(reg_idx), old_val, INSTR_TY_SUB);
            break;
        }
        case INSTR_DCR_M: {
            let old_val = cpu.get_Mem(cpu.get_HL());
            cpu.memory[cpu.get_HL()] -= 1;
            cpu.handle_Status_Flags(cpu.memory[cpu.get_HL()], old_val, INSTR_TY_SUB);
            break;
        }
        case INSTR_LDAX_B:
        case INSTR_LDAX_D: {
            let mask = 0b00010000;
            let rp_idx = RP_CODE_TO_IDX[(mask & instr) >> 4];
            cpu.move_Mem_To_Reg_Indir(REG_A, rp_idx);
            break;
        }
        case INSTR_STAX_B:
        case INSTR_STAX_D: {
            let mask = 0b00010000;
            let rp_idx = RP_CODE_TO_IDX[(mask & instr) >> 4];
            cpu.move_Reg_To_Mem_Indir(REG_A, rp_idx);
            break;
        }
        case INSTR_LHLD: {
            let addr = cpu.fetch_Word();
            cpu.move_Mem_To_Reg(REG_L, addr);
            cpu.move_Mem_To_Reg(REG_H, (addr + 1));
            break;
        }
        case INSTR_SHLD: {
            let addr = cpu.fetch_Word();
            cpu.move_Reg_To_Mem(addr, REG_L);
            cpu.move_Reg_To_Mem((addr + 1), REG_H);
            break;
        }
        case INSTR_XCHG: {
            let temp_hl = make_Word(cpu.get_Reg(REG_H), cpu.get_Reg(REG_L));
            cpu.move(REG_H, REG_D);
            cpu.move(REG_L, REG_E);
            cpu.set_RP(REG_D, temp_hl);
            break;
        }
        case INSTR_MOV_B_B:
        case INSTR_MOV_B_C:
        case INSTR_MOV_B_D:
        case INSTR_MOV_B_E:
        case INSTR_MOV_B_H:
        case INSTR_MOV_B_L:
        case INSTR_MOV_B_A:
        case INSTR_MOV_C_B:
        case INSTR_MOV_C_C:
        case INSTR_MOV_C_D:
        case INSTR_MOV_C_E:
        case INSTR_MOV_C_H:
        case INSTR_MOV_C_L:
        case INSTR_MOV_C_A:
        case INSTR_MOV_D_B:
        case INSTR_MOV_D_C:
        case INSTR_MOV_D_D:
        case INSTR_MOV_D_E:
        case INSTR_MOV_D_H:
        case INSTR_MOV_D_L:
        case INSTR_MOV_D_A:
        case INSTR_MOV_E_B:
        case INSTR_MOV_E_C:
        case INSTR_MOV_E_D:
        case INSTR_MOV_E_E:
        case INSTR_MOV_E_H:
        case INSTR_MOV_E_L:
        case INSTR_MOV_E_A:
        case INSTR_MOV_H_B:
        case INSTR_MOV_H_C:
        case INSTR_MOV_H_D:
        case INSTR_MOV_H_E:
        case INSTR_MOV_H_H:
        case INSTR_MOV_H_L:
        case INSTR_MOV_H_A:
        case INSTR_MOV_L_B:
        case INSTR_MOV_L_C:
        case INSTR_MOV_L_D:
        case INSTR_MOV_L_E:
        case INSTR_MOV_L_H:
        case INSTR_MOV_L_L:
        case INSTR_MOV_L_A:
        case INSTR_MOV_A_B:
        case INSTR_MOV_A_C:
        case INSTR_MOV_A_D:
        case INSTR_MOV_A_E:
        case INSTR_MOV_A_H:
        case INSTR_MOV_A_L:
        case INSTR_MOV_A_A: {
            let mask_dst = 0b00111000;
            let mask_src = 0b00000111;
            let dst_reg_idx = REG_CODE_TO_IDX[(mask_dst & instr) >> 3];
            let src_reg_idx = REG_CODE_TO_IDX[(mask_src & instr)];
            cpu.move(dst_reg_idx, src_reg_idx);
            break;
        }
        case INSTR_LXI_B:
        case INSTR_LXI_D:
        case INSTR_LXI_H: 
        case INSTR_LXI_SP: {
            let mask = 0b00110000;
            let rp_idx = RP_CODE_TO_IDX[(mask & instr) >> 4];
            cpu.register[rp_idx + 1] = cpu.fetch_Byte();
            cpu.register[rp_idx] = cpu.fetch_Byte();
            break;
        }
        case INSTR_MOV_A_M: 
        case INSTR_MOV_B_M: 
        case INSTR_MOV_C_M: 
        case INSTR_MOV_D_M:
        case INSTR_MOV_E_M:
        case INSTR_MOV_H_M: 
        case INSTR_MOV_L_M: {
            let mask = 0b00111000;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr) >> 3];
            cpu.move_Mem_To_Reg_Indir(reg_idx, REG_H);
            break;
        }
        case INSTR_MOV_M_A: 
        case INSTR_MOV_M_B: 
        case INSTR_MOV_M_C: 
        case INSTR_MOV_M_D:
        case INSTR_MOV_M_E:
        case INSTR_MOV_M_H: 
        case INSTR_MOV_M_L: {
            let mask = 0b00000111;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr)];
            cpu.move_Reg_To_Mem_Indir(reg_idx, REG_H);
            break;
        }
        case INSTR_MVI_A: 
        case INSTR_MVI_B:
        case INSTR_MVI_C:
        case INSTR_MVI_D:
        case INSTR_MVI_E:
        case INSTR_MVI_H:
        case INSTR_MVI_L: {
            let mask = 0b00111000;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr) >> 3];
            cpu.set_Reg(reg_idx, cpu.fetch_Byte());
            break;
        }
        case INSTR_MVI_M: {
            cpu.set_Mem(cpu.get_HL(), cpu.fetch_Byte());
            break;
        }
        case INSTR_ADI: {
            cpu.add(cpu.fetch_Byte());
            break;
        }
        case INSTR_ADD_B:
        case INSTR_ADD_C:
        case INSTR_ADD_D:
        case INSTR_ADD_E:
        case INSTR_ADD_H:
        case INSTR_ADD_L:
        case INSTR_ADD_A: {
            let mask = 0b00000111;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr)];
            cpu.add_Reg(reg_idx);
            break;
        }
        case INSTR_ADD_M: {
            cpu.add_Mem();
            break;
        }
        case INSTR_ACI: {
            cpu.add_Including_CY(cpu.fetch_Byte());
            break;
        }
        case INSTR_ADC_B:
        case INSTR_ADC_C:
        case INSTR_ADC_D:
        case INSTR_ADC_E:
        case INSTR_ADC_H:
        case INSTR_ADC_L:
        case INSTR_ADC_A: {
            let mask = 0b00000111;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr)];
            cpu.add_Reg_Including_CY(reg_idx);
            break;
        }
        case INSTR_ADC_M: {
            let mask = 0b00000111;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr)];
            cpu.add_Mem_Including_CY();
            break;
        }
        case INSTR_SUI: {
            cpu.sub(cpu.fetch_Byte());
            break;
        }
        case INSTR_SUB_B:
        case INSTR_SUB_C:
        case INSTR_SUB_D:
        case INSTR_SUB_E:
        case INSTR_SUB_H:
        case INSTR_SUB_L:
        case INSTR_SUB_A: {
            let mask = 0b00000111;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr)];
            cpu.sub_Reg(reg_idx);
            break;
        }
        case INSTR_SUB_M: {
            cpu.sub_Mem();
            break;
        }
        case INSTR_SBI: {
            cpu.sub_Including_CY(cpu.fetch_Byte());
            break;
        }
        case INSTR_SBB_B:
        case INSTR_SBB_C:
        case INSTR_SBB_D:
        case INSTR_SBB_E:
        case INSTR_SBB_H:
        case INSTR_SBB_L:
        case INSTR_SBB_A: {
            let mask = 0b00000111;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr)];
            cpu.sub_Reg_Including_CY(reg_idx);
            break;
        }
        case INSTR_SBB_M: {
            let mask = 0b00000111;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr)];
            cpu.sub_Mem_Including_CY();
            break;
        }
        case INSTR_DAD_B:
        case INSTR_DAD_D:
        case INSTR_DAD_H:
        case INSTR_DAD_SP: {
            let mask = 0b00110000;
            let rp_idx = RP_CODE_TO_IDX[(mask & instr) >> 4];
            cpu.add_Double(rp_idx);
            break;
        }
        case INSTR_STC: {
            cpu.set_Flag(FLAG_CY, 1);
            break;
        }
        case INSTR_CMC: {
            cpu.set_Flag(FLAG_CY, (1 - cpu.get_Flag(FLAG_CY)));
            break;
        }
        case INSTR_CMA: {
            cpu.set_Reg(REG_A, ~(cpu.get_Reg(REG_A)));
            break;
        }
        case INSTR_ANI: {
            cpu.and(cpu.fetch_Byte());
            break;
        }
        case INSTR_ANA_B:
        case INSTR_ANA_C:
        case INSTR_ANA_D:
        case INSTR_ANA_E:
        case INSTR_ANA_H:
        case INSTR_ANA_L:
        case INSTR_ANA_A: {
            let mask = 0b00000111;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr)];
            cpu.and_Reg(reg_idx);
            break;
        }
        case INSTR_ANA_M: {
            cpu.and_Mem();
            break;
        }
        case INSTR_XRI: {
            cpu.xor(cpu.fetch_Byte());
            break;
        }
        case INSTR_XRA_B:
        case INSTR_XRA_C:
        case INSTR_XRA_D:
        case INSTR_XRA_E:
        case INSTR_XRA_H:
        case INSTR_XRA_L:
        case INSTR_XRA_A: {
            let mask = 0b00000111;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr)];
            cpu.xor_Reg(reg_idx);
            break;
        }
        case INSTR_XRA_M: {
            cpu.xor_Mem();
            break;
        }
        case INSTR_CPI: {
            cpu.cmp_And_Set_Flags(cpu.get_Reg(REG_A), cpu.fetch_Byte());
            break;
        }
        case INSTR_ORI: {
            cpu.or(cpu.fetch_Byte());
            break;
        }
        case INSTR_ORA_B:
        case INSTR_ORA_C:
        case INSTR_ORA_D:
        case INSTR_ORA_E:
        case INSTR_ORA_H:
        case INSTR_ORA_L:
        case INSTR_ORA_A: {
            let mask = 0b00000111;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr)];
            cpu.or_Reg(reg_idx);
            break;
        }
        case INSTR_ORA_M: {
            cpu.or_Mem();
            break;
        }
        case INSTR_CMP_B:
        case INSTR_CMP_C:
        case INSTR_CMP_D:
        case INSTR_CMP_E:
        case INSTR_CMP_H:
        case INSTR_CMP_L:
        case INSTR_CMP_A: {
            let mask = 0b00000111;
            let reg_idx = REG_CODE_TO_IDX[(mask & instr)];
            cpu.cmp_Reg(reg_idx);
            break;
        }
        case INSTR_CMP_M: {
            cpu.cmp_Mem();
            break;
        }
        case INSTR_RLC: {
            cpu.rotate_Left_CY();
            break;
        }
        case INSTR_RRC: {
            cpu.rotate_Right_CY();
            break;
        }
        case INSTR_RAL: {
            cpu.rotate_Left_Through_CY();
            break;
        }
        case INSTR_RAR: {
            cpu.rotate_Right_Through_CY();
            break;
        }
        case INSTR_JMP: {
            let addr = cpu.fetch_Word();
            cpu.set_PC(addr);
            break;
        }
        case INSTR_JM: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_S) === 1) {
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_JP: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_S) === 0) {
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_JZ: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_Z) === 1) {
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_JNZ: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_Z) === 0) {
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_JPE: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_P) === 1) {
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_JPO: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_P) === 0) {
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_JC: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_CY) === 1) {
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_JNC: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_CY) === 0) {
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_PUSH_B: 
        case INSTR_PUSH_D: 
        case INSTR_PUSH_H: {
            let mask = 0b00110000;
            let rp_idx = RP_CODE_TO_IDX[(mask & instr) >> 4];
            cpu.push_RP(rp_idx);
            break;
        }
        case INSTR_PUSH_PSW: {
            cpu.push_PSW();
            break;
        }
        case INSTR_POP_B:
        case INSTR_POP_D:
        case INSTR_POP_H: {
            let mask = 0b00110000;
            let rp_idx = RP_CODE_TO_IDX[(mask & instr) >> 4];
            cpu.pop_RP(rp_idx);
            break;
        }
        case INSTR_POP_PSW: {
            cpu.pop_PSW();
            break;
        }
        case INSTR_CALL: {
            /*  call addr16
                working :-
                    1. fetch the addr16
                    2. store the curr PC contents onto the stack
                    3. set the PC to addr16  */
            let addr = cpu.fetch_Word();
            cpu.push_RP(REG_PC);
            cpu.set_PC(addr);
            break;
        }
        case INSTR_CM: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_S) === 1) {
                cpu.push_RP(REG_PC);
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_CP: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_S) === 0) {
                cpu.push_RP(REG_PC);
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_CZ: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_Z) === 1) {
                cpu.push_RP(REG_PC);
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_CNZ: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_Z) === 0) {
                cpu.push_RP(REG_PC);
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_CPE: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_P) === 1) {
                cpu.push_RP(REG_PC);
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_CPO: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_P) === 0) {
                cpu.push_RP(REG_PC);
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_CC: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_CY) === 1) {
                cpu.push_RP(REG_PC);
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_CNC: {
            let addr = cpu.fetch_Word();
            if(cpu.get_Flag(FLAG_CY) === 0) {
                cpu.push_RP(REG_PC);
                cpu.set_PC(addr);
            }
            break;
        }
        case INSTR_RET: {
            /*  ret
                working :-
                    1. pop a word off the stack top and set PC equal to it  */
            cpu.pop_RP(REG_PC);
            break;
        }
        case INSTR_RM: {
            if(cpu.get_Flag(FLAG_S) === 1) {
                cpu.pop_RP(REG_PC);
            }
            break;
        }
        case INSTR_RP: {
            if(cpu.get_Flag(FLAG_S) === 0) {
                cpu.pop_RP(REG_PC);
            }
            break;
        }
        case INSTR_RZ: {
            if(cpu.get_Flag(FLAG_Z) === 1) {
                cpu.pop_RP(REG_PC);
            }
            break;
        }
        case INSTR_RNZ: {
            if(cpu.get_Flag(FLAG_Z) === 0) {
                cpu.pop_RP(REG_PC);
            }
            break;
        }
        case INSTR_RPE: {
            if(cpu.get_Flag(FLAG_P) === 1) {
                cpu.pop_RP(REG_PC);
            }
            break;
        }
        case INSTR_RPO: {
            if(cpu.get_Flag(FLAG_P) === 0) {
                cpu.pop_RP(REG_PC);
            }
            break;
        }
        case INSTR_RC: {
            if(cpu.get_Flag(FLAG_CY) === 1) {
                cpu.pop_RP(REG_PC);
            }
            break;
        }
        case INSTR_RNC: {
            if(cpu.get_Flag(FLAG_CY) === 0) {
                cpu.pop_RP(REG_PC);
            }
            break;
        }
        case INSTR_XTHL: {
            // eXchange Top of stack with HL
            let temp_l = cpu.get_Mem(cpu.get_SP());
            cpu.inx_RP(REG_SP);
            let temp_h = cpu.get_Mem(cpu.get_SP());
            cpu.inx_RP(REG_SP);
            cpu.push_RP(REG_H);
            cpu.set_HL(make_Word(temp_h, temp_l));
            break
        }
        case INSTR_PCHL: {
            cpu.set_PC(cpu.get_HL());
            break;
        }
        case INSTR_SPHL: {
            cpu.set_SP(cpu.get_HL());
            break;
        }
        case INSTR_RST_0: 
        case INSTR_RST_1: 
        case INSTR_RST_2: 
        case INSTR_RST_3: 
        case INSTR_RST_4: 
        case INSTR_RST_5: 
        case INSTR_RST_6: 
        case INSTR_RST_7: {
            let mask = 0b00111000;
            let addr = ((mask & instr) >> 3) * 8;
            cpu.push_RP(REG_PC);
            cpu.set_PC(addr);
            break;
        }
        case INSTR_DAA: {
            let old_acc = cpu.get_Reg(REG_A);
            let acc_ln = cpu.get_Reg(REG_A) & 0x0F;
            if((acc_ln > 9) || (cpu.get_Flag(FLAG_AC) === 1)) {
                cpu.register[REG_A] += 0x06;
            }
            let acc_hn = (cpu.get_Reg(REG_A) >> 4) & 0x0F;
            let cy = cpu.get_Flag(FLAG_CY);
            if((acc_hn > 9) || (cy === 1)) {
                cpu.add(0x60);
            }
            let curr_cy = cpu.get_Flag(FLAG_CY);
            if((curr_cy === 1) || (cy === 1)) {
                cpu.set_Flag(FLAG_CY, 1);
            }
            break;
        }
        case INSTR_NOP: { 
            break; 
        }
        default: { 
            return false; 
        }
    }
    return true;
};

// make sure that the PC is set accordingly before calling this function.
const execute_next_instruction = (cpu) => {
    let instr = cpu.fetch_Byte();
    if(instr === INSTR_HLT) return false;
    if(!handle_instruction(cpu, instr)) {
        console.log("[ERROR] Invalid Instruction -> " + to_Hex2_Str(instr));
        return false;
    }
    return true;
};

