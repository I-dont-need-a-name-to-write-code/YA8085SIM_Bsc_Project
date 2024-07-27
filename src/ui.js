
const update_register_window = () => {
    let status = document.getElementById("status");
    status.innerHTML = "<i>Status</i>: <b>" + (global.is_running ? "running" : "halted") + "</b>";
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
        element.value = ctx.get_Flag(i);
    }
};

const create_address_data_div = (addr, value) => {
    let div = document.createElement("div");
    let address = document.createElement("input");
    address.type = "text";
    address.setAttribute("value", addr);
    address.readOnly = true;
    address.style = "border: 0px; background-color: #181818; width: 40px; color: #F0F0F0; outline: none; text-align: center;";
    let data = document.createElement("input");
    data.type = "text";
    data.setAttribute("value", value);
    data.readOnly = true;
    data.style = "border: 0px; background-color: #181818; width: 23px; margin-left: 40px; color: #F0F0F0; outline: none; text-align: center;";
    div.appendChild(address);
    div.innerHTML += "H";
    div.appendChild(data);
    div.innerHTML += "H";
    div.innerHTML = "<center>" + div.innerHTML + "</center>";
    return div;
};

const hex_to_number = (hex_str) => {
    let hex_lut = {
        '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 
        'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15
    };
    let number = 0;
    for(let i = 0; i < hex_str.length; ++i) {
        let ch = hex_str.charAt(i).toUpperCase();
        let x = hex_lut[ch];
        number <<= 4;
        number |= x;
    }
    return number;
};

const update_memory_viewer = () => {
    let default_html = "<font size='1px'><p>Please choose <br><b>start_addr</b> and <b>end_addr</b><br> to see memory contents.</p></font>";
    let mem_div = document.getElementById("memory_dump_div");
    mem_div.innerHTML = default_html;
    let start_addr = document.getElementById("memory_window_start_addr").value;
    let end_addr = document.getElementById("memory_window_end_addr").value;
    let hex_regex = new RegExp("^([0-9]|[a-f]|[A-F])+(H|h)$");
    if(!hex_regex.test(start_addr) || !hex_regex.test(end_addr)) {
        alert("Invalid <start|end> address in memory viewer!");
        return;
    }

    start_addr = start_addr.substring(0, start_addr.length - 1);
    start_addr = hex_to_number(start_addr);

    end_addr = end_addr.substring(0, end_addr.length - 1);
    end_addr = hex_to_number(end_addr);

    if(!(0 <= start_addr && start_addr <= MEMORY_SIZE)) {
        alert("start_addr specified is out of bounds!\nstart_addr = [0, " + MEMORY_SIZE + "]");
    }

    if(!(0 <= end_addr && end_addr <= MEMORY_SIZE)) {
        alert("end_addr specified is out of bounds!\nend_addr = [0, " + MEMORY_SIZE + "]");
    }

    if(start_addr > end_addr) {
        alert("start_addr cannot be greater than end_addr!");
        return;
    }

    let str = "";
    for(let i = start_addr; i <= end_addr; ++i) {
        let data = global.cpu_ctx.get_Mem(i);
        data = left_Pad(data.toString("16").toUpperCase(), '0', 2);
        let address = left_Pad(i.toString("16").toUpperCase(), '0', 4);
        str += create_address_data_div(address, data).innerHTML;
    }
    mem_div.innerHTML = str;
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