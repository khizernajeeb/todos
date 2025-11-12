-- Migration: Ensure completed field is NOT NULL with default FALSE
-- This fixes the column if it was made optional previously

-- Step 1: Update any existing NULL values to FALSE
UPDATE todos 
SET completed = FALSE 
WHERE completed IS NULL;

-- Step 2: Set NOT NULL constraint (safe now since no NULLs exist)
ALTER TABLE todos 
ALTER COLUMN completed SET NOT NULL;

-- Step 3: Ensure default is FALSE
ALTER TABLE todos 
ALTER COLUMN completed SET DEFAULT FALSE;