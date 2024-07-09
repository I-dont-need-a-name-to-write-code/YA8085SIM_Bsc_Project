
global.runner_worker_handle.onmessage = (msg_from_runner) => {
    let msg_data = JSON.parse(msg_from_runner.data);
    copy_CPU_Context(global.cpu_ctx, msg_data);
    global.cpu_ctx.log();
    global.is_running = false;
};

const compile = () => {
    let code_str = editor.getValue();
    let code = generate_machine_code(code_str); // [0] = start_addr | [1] = bytes(mc) array
    if(code === null) {
        alert("Machine Code Generation Failed");
        return null;
    }
    global.cpu_ctx.reset();
    for(let byte of code[1]) {
        global.cpu_ctx.set_Mem(byte.addr, byte.data);
    }
    global.is_compiled = true;
    alert("Machine Code Has Been Generated\n_start -> " + to_Hex2_Str(code[0]));
}

document.getElementsByClassName("compile_button")[0].addEventListener("click", (event) => {
    compile();
    update_register_window();
});

editor.on('change', (event) => {
    global.is_compiled = false;
});

update_register_window();
