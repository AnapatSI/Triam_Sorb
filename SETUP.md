# Triam Sorb - AI-Powered Learning Platform Setup Guide

## Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- OpenAI API key (for AI analysis features)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Triam_Sorb-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI Configuration (Required for AI analysis)
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional: Anthropic Claude (Alternative AI provider)
   NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   
   # Optional: Local API (if using local AI service)
   NEXT_PUBLIC_LOCAL_API_KEY=your_local_api_key_here
   ```

## OpenAI API Setup

To use the AI analysis features, you need an OpenAI API key:

1. **Get an OpenAI API key**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account
   - Go to "API Keys" section
   - Create a new API key
   - Copy the key to your `.env.local` file

2. **API Key Security**
   - Never commit your API key to version control
   - The key is prefixed with `NEXT_PUBLIC_` for client-side access
   - Consider using environment-specific keys for production

3. **Cost Considerations**
   - GPT-3.5-turbo is used by default (cost-effective)
   - GPT-4 is available for more complex analysis
   - Monitor your usage in the OpenAI dashboard

## Running the Application

1. **Development mode**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The application should be running with AI features enabled

## AI Configuration

The application supports multiple AI providers:

### OpenAI (Default - GPT-3.5)
- **Model**: `gpt-3.5-turbo`
- **Features**: Cost-effective, fast responses
- **Best for**: General understanding analysis

### OpenAI GPT-4
- **Model**: `gpt-4`
- **Features**: More advanced analysis, higher accuracy
- **Best for**: Complex educational content

### Anthropic Claude
- **Model**: `claude-3-sonnet-20240229`
- **Features**: Alternative AI provider
- **Best for**: Different analysis perspective

### Mock Mode
- **Model**: `mock-model`
- **Features**: Simulated responses for development
- **Best for**: Testing without API costs

## Usage

1. **Upload Learning Content**
   - Go to the Upload page
   - Upload your educational content (PDF, DOCX, TXT)
   - The system will parse and prepare the content

2. **Learn and Analyze**
   - Go to the Learn page
   - Read the uploaded content
   - Write your understanding in the text area
   - Submit for AI analysis

3. **Review AI Feedback**
   - Get comprehensive analysis of your understanding
   - Review strengths and areas for improvement
   - Follow suggestions for better learning

## Troubleshooting

### AI Not Working
- Check if your API key is correctly set in `.env.local`
- Verify the API key has sufficient credits
- Check browser console for error messages
- Ensure you're not hitting rate limits

### Environment Variables Not Loading
- Restart the development server after adding `.env.local`
- Ensure the file is in the root directory
- Check that variable names start with `NEXT_PUBLIC_`

### Performance Issues
- Consider switching to GPT-3.5-turbo for faster responses
- Monitor API usage and costs
- Use mock mode for development/testing

## Production Deployment

1. **Set production environment variables**
   - Use your hosting platform's environment variable settings
   - Ensure API keys are properly configured

2. **Build the application**
   ```bash
   npm run build
   npm start
   ```

3. **Monitor AI usage**
   - Track API calls and costs
   - Set up alerts for usage limits
   - Consider implementing rate limiting

## Support

For issues related to:
- **AI Analysis**: Check OpenAI API status and your account
- **Application**: Check the browser console and server logs
- **Setup**: Ensure all prerequisites are met

## License

This project is licensed under the MIT License. 