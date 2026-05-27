# Manual Release Process (Option 1)

This is the safest, lowest-automation path. Use it for the very first 1.0.0 release or if automation has issues.

## Prerequisites
- All changes merged to `master`
- Full verification passed (`bash verify.sh`, security protocol, etc.)
- You have local write access + necessary tokens

## Step-by-Step

1. **Prepare locally**
   ```bash
   git checkout master
   git pull
   npm ci
   npm run build
   ```

2. **Run full verification**
   ```bash
   npm run protocol:security
   npm run protocol:verify
   bash verify.sh
   npm pack --dry-run
   ```

3. **Create the release tag**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

4. **Build binaries locally** (or use CI artifacts)
   Use `bun build --compile` for the 5 main targets.

5. **Create GitHub Release**
   - Go to GitHub → Releases → Draft new release
   - Use the tag `v1.0.0`
   - Upload all binaries + `checksums.txt`
   - Write release notes

6. **Publish to npm**
   ```bash
   npm publish --provenance --access public
   ```

7. **Update package managers (manual)**
   - Update Homebrew tap formula
   - Update Scoop bucket manifest
   - Submit Winget manifest PR (if doing it)

## When to Use This Option
- First release
- When you want maximum control
- When automation is not yet trusted

## Drawbacks
- Error-prone
- Time consuming for multi-platform
- No easy repeatability

**Recommendation:** Use this only for v1.0.0, then move to one of the automated options.