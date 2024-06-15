


let global = {
    cpu_ctx: new CPU_Context(),
    runner_worker_handle: new Worker("runner_worker.js"),
    is_running: false,
    is_paused: false,
};

global.runner_worker_handle.onmessage = (msg_from_runner) => {
    let msg_data = JSON.parse(msg_from_runner.data);
    copy_CPU_Context(global.cpu_ctx, msg_data);
    global.cpu_ctx.log();
    global.is_running = false;
};

const execute_program = (cpu, prog_addr) => {
    if(global.is_running) return false;
    cpu.reset();
    cpu.set_PC(prog_addr);
    global.is_running = true;
    global.runner_worker_handle.postMessage(JSON.stringify(cpu));
    return true;
}; 

function enable_Tab(id) {
    var el = document.getElementById(id);
    el.onkeydown = function(e) {
        if (e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;
            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);
            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;
            // prevent the focus lose
            return false;
        }
    };
}

const main = () => {
    let ta_id = "code_area"; 
    enable_Tab(ta_id);
};

main();

