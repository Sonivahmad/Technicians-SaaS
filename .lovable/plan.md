

## Plan: Service Presets & Spare Parts Management in Settings

### Overview
Replace the static "Coming soon" buttons for Service Presets and Spare Parts in SettingsPage with full CRUD management pages. No database changes needed — tables and RLS already exist.

### Implementation Steps

**1. Add mutation functions to existing hooks**
- `useServicePresets.tsx`: Add `addPreset`, `updatePreset`, `deletePreset` mutations using `useMutation` + `queryClient.invalidateQueries`
- `useSpareParts.tsx`: Add `addPart`, `updatePart`, `deletePart` mutations similarly

**2. Create `src/pages/ServicePresetsPage.tsx`**
- List all presets as cards showing name, description, labour cost, base cost
- "Add Preset" button opens a Dialog with form fields: preset_name, description, default_labour_cost, default_base_cost
- Each card has Edit and Delete buttons
- Edit opens same dialog pre-filled; Delete shows confirmation via AlertDialog
- Bilingual labels (Hindi + English)

**3. Create `src/pages/SparePartsPage.tsx`**
- List all parts as cards showing part_name and price
- "Add Part" button opens Dialog with fields: part_name, price
- Edit/Delete per item with confirmation
- Bilingual labels

**4. Add routes in `App.tsx`**
- `/settings/presets` → ServicePresetsPage
- `/settings/parts` → SparePartsPage

**5. Update `SettingsPage.tsx`**
- Wire "Service Presets" button to navigate to `/settings/presets`
- Wire "Spare Parts" button to navigate to `/settings/parts`
- Keep other items as "Coming soon"

### Technical Details
- All mutations include `user_id` from `useAuth` session to satisfy RLS policies
- Input validation: required fields, numeric price/cost > 0, max lengths
- Uses existing UI components: Dialog, Input, Button, AlertDialog
- `queryClient.invalidateQueries(['service_presets'])` / `['spare_parts']` after mutations to keep data fresh

