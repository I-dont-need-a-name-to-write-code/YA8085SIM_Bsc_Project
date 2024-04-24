
importScripts("hexcodes.js"); 
importScripts("sim8085.js"); 

let cpu_ctx = new CPU_Context();

onmessage = (msg_from_main) => {
    let msg_data = JSON.parse(msg_from_main.data);
    copy_CPU_Context(cpu_ctx, msg_data);
    while(execute_next_instruction(cpu_ctx)) {}
    postMessage(JSON.stringify(cpu_ctx));
};
