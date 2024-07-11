
const update_register_window = () => {
    let ctx = global.cpu_ctx;
    let reg_ids = ['regA', 'regF', 'regB', 'regC', 'regD', 'regE', 'regH', 'regL'];
    let regs = [
        ctx.get_Reg(REG_A),
        ctx.get_Flag_Reg(),
        ctx.get_Reg(REG_B),
        ctx.get_Reg(REG_C),
        ctx.get_Reg(REG_D),
        ctx.get_Reg(REG_E),
        ctx.get_Reg(REG_H),
        ctx.get_Reg(REG_L)
    ];
    for(let i = 0; i < reg_ids.length; ++i) {
        let hex_reg_val = regs[i].toString('16').toUpperCase();
        let element = document.getElementById(reg_ids[i]);
        element.value = (hex_reg_val.length < 2) ? ('0' + hex_reg_val) : hex_reg_val;
    }

    let flag_ids = ['flagS', 'flagZ', 'flagAC', 'flagP', 'flagCY'];
    for(let i = 0; i < flag_ids.length; ++i) {
        let element = document.getElementById(flag_ids[i]);
        element.value = "0" + ctx.get_Flag(i);
    }
};

var editor = CodeMirror.fromTextArea(
             document.getElementById("code_area"), {
                mode: "8085",
                theme: "dracula",
                styleActiveLine: true,
                lineNumbers: true,
                lineWrapping: true
            });
editor.setSize("100%", "100%");
editor.refresh();
