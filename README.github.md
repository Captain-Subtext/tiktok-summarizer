# GitHub Release Process Guide

This document outlines the step-by-step process for creating new releases of the TikTok Summarizer project.

## Pre-Commit Verification

### Test Data Check
- Verify no sensitive data in commits
- Check for test credentials
- Remove any personal tokens/keys

### Performance Check
- Run Lighthouse tests
- Check bundle sizes
- Verify load times

## Version Number Guidelines
- Major version (X.0.0): Breaking changes
- Minor version (0.X.0): New features
- Patch version (0.0.X): Bug fixes
- Use semantic versioning (X.Y.Z)

## Deployment Checklist
- Verify environment variables
- Check SSL certificates
- Update CDN cache
- Monitor server logs
- Check database connections
- Verify third-party integrations

## Troubleshooting Common Issues
### Git Issues
- Merge conflicts resolution
- Tag conflicts
- Branch cleanup

### Database Issues
- Migration failures
- Rollback procedures
- Data integrity checks

### Deployment Issues
- Environment mismatches
- Build failures
- Runtime errors

## 1. Pre-Release Code Review

### Linting and Type Checking

Run in client directory

cd client
npm run lint
npm run type-check

Run in server directory

cd ../server
npm run lint


### Code Cleanup
- Remove development console.logs
- Address TODO comments
- Remove test/mock data
- Move hardcoded values to config files
- Remove unused imports
- Clean up commented code

## 2. Database Management

### Schema Review

Check current schema

cd server
npx prisma format

### Migrations

Generate new migration

npx prisma migrate dev --name descriptive_name

Verify migration

npx prisma migrate reset --force

### Backup

Export database backup

npx prisma db pull > backup_$(date +%Y%m%d).sql

- Store backup securely
- Test backup restoration

## 3. Documentation Updates

### README.md
- Update version number
- Document new features
- Update configuration requirements
- Verify installation steps
- Update screenshots

### API Documentation
- Document new endpoints
- Update endpoint specs
- Update examples
- Verify status codes

## 4. Git Process

### Branch Management

Create release branch

git checkout -b release/v[X.Y]

Verify current status

git status

### Staging Changes

Stage changes in logical groups
git add client/src/components/TestDashboard/
git add client/src/components/Navbar.
git add server/src/routes/
git add prisma/
git add README.md

- Review staged changes
- Group related changes

### Commit

Create structured commit

git commit -m "v[X.Y]: Brief Title

Features:
 - Feature 1
 - Feature 2

Changes:
 - Change 1
 - Change 2

Database:
 - Migration details"

### Tagging

Create annotated tag

git tag -a v[X.Y] -m "Version [X.Y] - Feature description"

Push changes

git push origin release/v[X.Y]
git push origin v[X.Y]

## 5. Post-Release Steps

### Merge Process

Switch to main branch

git checkout main

Merge release branch

git merge release/v[X.Y] --no-ff

Push to main

git push origin main

### Cleanup

Delete release branch (optional)

git branch -d release/v[X.Y]

Create new development branch

git checkout -b v[X.Y+1]-development

### Verification
- Check deployment
- Verify migrations
- Test core functionality
- Monitor errors
- Check documentation

## Emergency Rollback Procedure

If issues are detected:

Revert to previous tag

git checkout v[X.Y-1]

Create emergency fix branch

git checkout -b hotfix/v[X.Y.1]

### Database rollback:

Rollback last migration

npx prisma migrate reset

npx prisma migrate to previous_migration_name

## Notes
- Test in staging first
- Document process deviations
- Update guide as needed

