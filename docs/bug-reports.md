# Bug Reports - AdmuseEasy

## BUG004 - Frontend API calls fail with relative URLs in development

**Date:** January 9, 2025  
**Reporter:** Developer  
**Severity:** High  
**Priority:** High  
**Status:** Fixed  

### Description
Frontend API calls using relative URLs (`/api/generate-copy`) fail in development environment, causing "Failed to generate ad" error message.

### Steps to Reproduce
1. Start backend server on port 5000
2. Start frontend on port 3000
3. Fill out ad generation form
4. Click "Generate Ad" button
5. Error message appears: "Failed to generate ad. Please try again."

### Expected Behavior
Ad generation should work and return AI-generated copy from Gemini API.

### Actual Behavior
API call fails silently, frontend shows generic error message.

### Root Cause
Frontend was making API calls to relative URL `/api/generate-copy` which resolves to `http://localhost:3000/api/generate-copy` instead of the backend server at `http://localhost:5000/api/generate-copy`.

### Solution
Changed API call from relative URL to absolute URL:
```javascript
// Before (broken)
fetch('/api/generate-copy', {...})

// After (fixed)
fetch('http://localhost:5000/api/generate-copy', {...})
```

### Files Modified
- `client/src/App.js` - Updated API call URL
- Added error handling for HTTP status codes

### Testing
- ✅ Ad generation works in development
- ✅ Error handling improved
- ✅ Gemini AI integration functional

### Notes
- This is a common issue in full-stack development
- Consider using environment variables for API URLs in production
- Could implement proxy configuration as alternative solution

---

## BUG005 - Gemini AI returns malformed JSON occasionally

**Date:** January 9, 2025  
**Reporter:** Developer  
**Severity:** Medium  
**Priority:** Medium  
**Status:** Open  

### Description
Gemini AI occasionally returns malformed JSON that cannot be parsed, causing ad generation to fail.

### Steps to Reproduce
1. Generate multiple ads with different products
2. Occasionally (1 in 10 attempts) the API returns invalid JSON
3. Frontend shows "Failed to generate ad" error

### Expected Behavior
Gemini AI should always return valid JSON in the specified format.

### Actual Behavior
Sometimes returns text with extra characters or incomplete JSON structure.

### Root Cause
AI model occasionally includes explanatory text before/after JSON or generates incomplete responses.

### Solution (Proposed)
Add JSON validation and cleanup before parsing:
```javascript
// Extract JSON from AI response
const jsonMatch = text.match(/\{[\s\S]*\}/);
if (jsonMatch) {
  const cleanJson = jsonMatch[0];
  const aiCopy = JSON.parse(cleanJson);
} else {
  // Fallback to static copy
}
```

### Files Modified
- `server/index.js` - Add JSON extraction logic

### Testing
- ⏳ Needs implementation
- ⏳ Test with various product inputs
- ⏳ Verify fallback mechanism

### Notes
- Common issue with AI-generated structured data
- Consider adding retry mechanism
- Monitor AI response patterns

---

## Template for Future Bugs

### BUG### - [Title]

**Date:**  
**Reporter:**  
**Severity:** Critical/High/Medium/Low  
**Priority:** High/Medium/Low  
**Status:** Open/In Progress/Fixed/Closed  

### Description
[Brief description of the bug]

### Steps to Reproduce
1. 
2. 
3. 

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Root Cause
[Technical explanation]

### Solution
[How it was fixed]

### Files Modified
- 

### Testing
- 

### Notes
[Additional information]