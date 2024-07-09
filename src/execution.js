

// make sure that the PC is set accordingly before calling this function.
const execute_next_instruction = (cpu_ctx) => {
    let instr = cpu_ctx.fetch_Byte();
    if(instr === INSTR_HLT) return false;
    if(!handle_instruction(cpu_ctx, instr)) {
        console.log("[ERROR] Invalid Instruction -> " + to_Hex2_Str(instr));
        return false;
    }
    return true;
};

const execute_program = (cpu_ctx, prog_addr) => {
    if(global.is_running) return false;
    cpu_ctx.reset();
    cpu_ctx.set_PC(prog_addr);
    global.is_running = true;
    global.runner_worker_handle.postMessage(JSON.stringify(cpu_ctx));
    return true;
}; 

const run_program = (cpu_ctx, code_str) => {
    let code = generate_machine_code(code_str); // [0] = start_addr | [1] = bytes(mc) array
    if(code === null) {
        alert("Machine Code Generation Failed");
        return null;
    }
    cpu_ctx.reset();
    for(let byte of code[1]) {
        cpu_ctx.set_Mem(byte.addr, byte.data);
    }
    execute_program(cpu_ctx, code[0]);
};

