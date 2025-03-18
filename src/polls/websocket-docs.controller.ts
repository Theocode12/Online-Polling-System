import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('WebSocket')
@Controller('websocket')
export class WebSocketDocsController {
  @Get()
  @ApiOperation({
    summary: 'WebSocket Guide',
    description:
      `**WebSocket URL:** ws://localhost:3000\n
    **Event Name:** voteUpdates\n` +
      '\n' +
      '✅ **Recommended Client: Socket.IO**\n' +
      'import { io } from "socket.io-client";\n' +
      'const socket = io("ws://localhost:3000");\n' +
      'socket.emit("subscribe", { pollId: "123" });\n' +
      'socket.on("voteUpdates", (data) => console.log(data));\n' +
      '\n' +
      '🌐 **Alternative: Native WebSocket (ws)**\n' +
      'const socket = new WebSocket("ws://localhost:3000");\n' +
      'socket.onopen = () => socket.send(JSON.stringify({ event: "subscribe", pollId: "123" }));\n' +
      'socket.onmessage = (event) => console.log(JSON.parse(event.data));\n' +
      '\n' +
      '📌 **Response Format**\n' +
      '{\n' +
      '  "poll_id": "123",\n' +
      '  "poll_options": [\n' +
      '    { "id": "1", "title": "Option A", "votes": 10 },\n' +
      '    { "id": "2", "title": "Option B", "votes": 5 }\n' +
      '  ]\n' +
      '}'
  })
  getWebSocketDocs() {
    return { message: 'WebSocket Documentation' };
  }
}
