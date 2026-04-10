# 📄 Resume Builder API

A backend API for a Resume Builder application where users can create, manage, and customize their professional resumes. Built with Next.js, Node.js, MongoDB, and JWT authentication.

---

## 🚀 Project Flow

### User Journey Flow
  User Signs Up
       ↓

  User Logs In (receives JWT token)
       ↓

  User Creates Resumes (multiple resumes allowed)
       ↓

  User Can:
  ├── View all their resumes
  ├── View a specific resume
  ├── Update any resume
  └── Delete any resume

### Authentication Flow
  Signup Request → Hash Password → Save User → Return Success
                            ↓
  Login Request → Verify Credentials → Generate JWT → Return Token
                            ↓
  Protected Routes → Validate JWT → Check User ID → Allow/Deny Access


### Resume Management Flow
  Create Resume → Validate Data → Attach User ID → Save to DB → Return Resume ID
                            ↓
  Get Resumes → Verify JWT → Filter by User ID → Return User's Resumes Only
                            ↓
  Update Resume → Verify Ownership → Update Fields → Save Changes
                            ↓
  Delete Resume → Verify Ownership → Remove from DB