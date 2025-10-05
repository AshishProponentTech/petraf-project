# 🏢 Admin-Generated Employee Token System

## Current System vs. Desired System

### **Current System (Automatic)**
- Employee visits app → Creates session → Gets resume token
- Token is for resuming their own session

### **Desired System (Admin-Generated)**
- HR/Admin creates tokens for employees
- Employee uses admin-generated token to access the system
- More control over who can access the system

## 🔧 Implementation Options

### **Option 1: Admin Creates Pre-configured Sessions**

```javascript
// Admin creates a session for a specific employee
const employeeSession = await api.createEmployeeSession({
  employee_code: "EMP12345",
  department: "Engineering", 
  position: "Software Engineer",
  grade: "L4",
  email: "sarah.johnson@company.com",
  expires_in_days: 30
});

// Returns a special token for the employee
// Employee uses this token to access the system
```

### **Option 2: Admin Generates Invitation Tokens**

```javascript
// Admin generates invitation tokens
const invitationToken = await api.createInvitationToken({
  employee_email: "sarah.johnson@company.com",
  department: "Engineering",
  position: "Software Engineer", 
  expires_in_days: 7,
  max_uses: 1
});

// Admin sends token to employee via email
// Employee uses token to start their session
```

### **Option 3: Admin Manages Employee Access**

```javascript
// Admin creates employee accounts
const employee = await api.createEmployee({
  employee_code: "EMP12345",
  name: "Sarah Johnson",
  email: "sarah.johnson@company.com",
  department: "Engineering",
  position: "Software Engineer",
  grade: "L4",
  status: "active"
});

// Employee logs in with their credentials
// System creates session automatically
```

## 🎯 Recommended Approach: Option 2 (Invitation Tokens)

This gives HR/Admin the most control:

### **Admin Workflow:**
1. **HR creates invitation token** for employee
2. **HR sends token via email** to employee  
3. **Employee uses token** to start their session
4. **Token expires** after use or time limit

### **Employee Workflow:**
1. **Employee receives email** with invitation token
2. **Employee visits app** and enters token
3. **System creates session** with pre-filled employee info
4. **Employee continues** with goal-setting process

## 🔧 Implementation Steps

### **Step 1: Add Admin Endpoints**

```typescript
// New admin endpoints needed
POST /api/admin/invitations/create
GET /api/admin/invitations
POST /api/admin/invitations/{token}/revoke
```

### **Step 2: Add Employee Token Validation**

```typescript
// New employee endpoints needed  
POST /api/employee/validate-invitation
POST /api/employee/start-session
```

### **Step 3: Update Frontend**

```typescript
// Add invitation token screen
const InvitationScreen = () => {
  const [token, setToken] = useState('');
  
  const handleValidateToken = async () => {
    const result = await api.validateInvitationToken(token);
    if (result.valid) {
      // Start session with pre-filled employee info
      const session = await api.startEmployeeSession(token);
      // Navigate to goal-setting flow
    }
  };
};
```

## 📋 Current Status

### **What's Available Now:**
- ✅ **Automatic resume tokens** (for session resumption)
- ✅ **Admin API access** (for system management)
- ✅ **Tenant management** (for company setup)

### **What Needs to Be Built:**
- ❌ **Admin invitation system** (for employee access control)
- ❌ **Employee token validation** (for invitation tokens)
- ❌ **Pre-configured sessions** (with employee info)
- ❌ **Email integration** (for sending invitations)

## 🚀 Quick Implementation

If you want to implement this quickly, you could:

### **Option A: Use Current System + Admin Control**
1. **Admin creates sessions** using existing API
2. **Admin shares session tokens** with employees
3. **Employees use tokens** to resume sessions

### **Option B: Add Simple Invitation System**
1. **Add invitation token generation** to admin panel
2. **Add token validation** to employee flow
3. **Use existing session system** after validation

## 💡 Recommendation

For now, **use the current automatic system** because:
- ✅ **It's already working** and tested
- ✅ **No additional development** needed
- ✅ **Employees can start immediately**
- ✅ **Sessions are secure** with JWT tokens

If you need admin control later, we can implement the invitation system as a future enhancement.


