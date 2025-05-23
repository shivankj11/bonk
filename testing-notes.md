# Chrome Website Blocker Extension - Testing Notes

## Testing Checklist

1. **Extension Loading**
   - Verify extension loads correctly in Chrome developer mode
   - Confirm icons display properly in browser toolbar

2. **Options Page Functionality**
   - Verify options page opens correctly
   - Test adding websites to block list
   - Test removing websites from block list
   - Test setting different blocking durations
   - Verify data persistence after browser restart

3. **Blocking Functionality**
   - Test blocking of exact domain matches
   - Test blocking of subdomain wildcards
   - Verify temporary blocking duration works as expected
   - Check that blocking expires after set duration

4. **Blocking Page Display**
   - Verify blocked page shows correct image
   - Confirm countdown timer works
   - Verify tab closes automatically after countdown

5. **Edge Cases**
   - Test with empty block list
   - Test with very short/long blocking durations
   - Test with invalid website formats
   - Verify behavior when blocking is not active
