const { spawn } = require('child_process');

const mcpProcess = spawn('npx', ['-y', '@upstash/context7-mcp@latest'], {
    stdio: ['pipe', 'pipe', 'inherit'],
    shell: true,
});

let outputStr = '';

mcpProcess.stdout.on('data', (data) => {
    const str = data.toString();
    outputStr += str;
    // Try to parse the complete JSON lines
    const lines = outputStr.split('\n');
    outputStr = lines.pop(); // keep incomplete line

    for (const line of lines) {
        if (line.trim() === '') continue;
        try {
            const msg = JSON.parse(line);
            //console.log('<-', JSON.stringify(msg, null, 2));

            if (msg.id === 1 && !msg.error) {
                // Initialization successful, send initialized notification
                mcpProcess.stdin.write(JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'notifications/initialized'
                }) + '\n');

                console.log('Initialized successfully. Requesting Supabase docs...');
                // Request Supabase docs
                mcpProcess.stdin.write(JSON.stringify({
                    jsonrpc: '2.0',
                    id: 2,
                    method: 'tools/call',
                    params: {
                        name: 'query-docs',
                        arguments: {
                            libraryId: '/supabase/supabase-js',
                            query: 'auth'
                        }
                    }
                }) + '\n');
            }

            if (msg.id === 2) {
                if (msg.error) {
                    console.error('Error fetching docs:', msg.error);
                } else {
                    console.log('\n--- Supabase Docs Result ---\n');
                    const result = msg.result;
                    if (result && result.content && result.content.length > 0) {
                        console.log(result.content[0].text.substring(0, 1000) + '...\n\n(Truncated for brevity)');
                        // Write full output to file
                        require('fs').writeFileSync('supabase_docs.md', result.content[0].text);
                        console.log('Saved full documentation to supabase_docs.md');
                    } else {
                        console.log('No content in tool call result.');
                    }
                }
                process.exit(0);
            }
        } catch (e) {
            // Ignore parse errors as output stream may interleave
        }
    }
});

const initMsg = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
        clientInfo: { name: 'test-client', version: '1.0' },
        protocolVersion: '2024-11-05',
        capabilities: {}
    }
};

mcpProcess.stdin.write(JSON.stringify(initMsg) + '\n');

// Timeout to prevent hanging
setTimeout(() => {
    console.error('Timeout waiting for response.');
    process.exit(1);
}, 15000);
