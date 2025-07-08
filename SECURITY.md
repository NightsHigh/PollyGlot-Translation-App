# 🔒 Security Guidelines

## API Key Security

### ⚠️ Important Security Notice

**Frontend applications expose all environment variables to users.** Any API key you add to this app will be visible in:

- Browser developer tools
- Network requests
- Built application bundle

### 🛡️ Security Best Practices

#### For Public Demos

- **✅ Use demo mode only** (no real API keys)
- **✅ Let users add their own keys** for real functionality
- **✅ Include security warnings** in documentation

#### For Personal Use

- **✅ Use read-only API keys** with minimal permissions
- **✅ Set usage limits** in API provider dashboards
- **✅ Monitor API usage** regularly
- **✅ Rotate keys** periodically

#### For Production Apps

- **✅ Use backend proxy** to hide API keys
- **✅ Implement rate limiting** on your server
- **✅ Add user authentication** if needed
- **✅ Monitor and log** API usage

### 🔑 API Key Recommendations

#### Hugging Face (Free & Safer)

- **Token Type**: Read-only
- **Permissions**: None selected
- **Risk**: Low (free tier has built-in limits)

#### OpenAI (Paid)

- **Key Type**: Project-specific if available
- **Usage Limits**: Set monthly spending limits ($5-10)
- **Risk**: Medium (costs money if abused)

### 🚨 If Your Key is Compromised

1. **Immediately revoke** the compromised key
2. **Generate a new key** with stricter limits
3. **Review usage logs** for unexpected activity
4. **Update your application** with the new key

### 🎯 Alternative Solutions

#### Backend Proxy (Recommended for Production)

```
Frontend → Your Backend API → Translation Service
```

- API keys stay on your server
- Add authentication, rate limiting, caching
- Full control over usage and costs

#### Serverless Functions

- Use Netlify/Vercel functions
- API keys in environment variables (server-side)
- Automatic scaling and security

### 📋 Deployment Security Checklist

- [ ] API keys not committed to git
- [ ] Usage limits set on API providers
- [ ] Clear documentation about security implications
- [ ] Demo mode available for public use
- [ ] Instructions for users to add their own keys

## Reporting Security Issues

If you discover a security vulnerability, please email [your-email@example.com](mailto:your-email@example.com) instead of creating a public issue.
