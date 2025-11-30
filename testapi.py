import os

os.environ['HTTP_PROXY'] = 'http://127.0.0.1:7890'
os.environ['HTTPS_PROXY'] = 'http://127.0.0.1:7890'

import anthropic

client = anthropic.Anthropic(
    # 从环境变量读取 API 密钥
    # 请设置环境变量: ANTHROPIC_API_KEY=your_api_key_here
    api_key=os.environ.get("ANTHROPIC_API_KEY", "YOUR_API_KEY_HERE"),
)
try:
    # 尝试更简单的模型和请求
    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=100,
        messages=[
            {"role": "user", "content": "Hello"}
        ]
    )
    print(message.content)
except Exception as e:
    print(f"详细错误：{e}")
    # 打印更多调试信息
    import traceback
    traceback.print_exc()
