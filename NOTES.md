# App notes — decisions to revisit

A running list of open judgment calls across the app — choices I made with a
sensible default that you might want to change later. Each item says **what it
is**, **where**, the **current choice**, the **alternative**, and **how to
switch**. Delete an item once you've decided; add a new section per feature area
as the app grows.

---

## Lesson image pipeline

The restored manifest now has a repeatable updater:
`image-pipeline/update-lesson-visual-manifest.js`. Run it after any new image
batch to refresh both `lesson-visual-manifest.json` and
`lesson-visual-manifest.md` from the shot lists, registered assets, and external
Primer markdown.

Latest completed batch: **Final remaining categories**. The restored manifest is clean at
**1584 / 1584** (`103` category heroes, `1481` lesson visuals), and lesson image coverage is
**740 / 740**. The tracker in `image-pipeline/category-progress.md` now shows
that all lesson visual batches are complete.

Follow-up sync completed: the bundled app `content/` finance markdown was updated from
the Primer source image keys. Local app content now has **48 / 48** Money &
Finance lessons with images, and **58 / 58** bundled `content/` lessons with at
least one image. All local `image:` keys resolve through `src/constants/images.ts`.

### Quality reset rule

Coverage is not the same as acceptable art quality. The pilot visuals for
**Money & Finance** and **Mindfulness & Mental Wellbeing** are the quality bar and
should be kept. The later mass-generated batches should be treated as
placeholder assets until regenerated and reviewed.

Do **not** compensate for generation time by accepting weak visuals. Every lesson
visual should look aligned with the current full-screen lesson UI: polished dark
mobile-card artwork, strong readable subject, no text/watermarks/logos, and a
clear concept that lands quickly at phone size. Regenerate in smaller batches and
inspect the output before replacing assets.

The redo tracker is `image-pipeline/quality-regeneration-progress.md`. Use that
file, not `category-progress.md`, to continue the quality pass.

### Lesson visual quality redo - relationships/tools/electrical bridge

2026-06-29: Completed the next 20 quality-regenerated assets from
`nurturingFriendshipsHero` through `breakerHero`. The accepted batch includes
the remaining adult friendship/family/help visuals, Tools and Electrical Safety
category heroes, and the first Tools/Electrical lesson visuals. All 20 were
copied into `assets/images`, normalized to `1672x941`, registered in
`src/constants/images.ts`, and QA'd by contact sheet for no readable text,
letters, digits, labels, logos, UI screenshots, equation glyphs, or watermarks.
Manifest coverage moved from `279 / 1584` to `299 / 1584`; `1285` assets remain
pending in the quality redo.

Next quality batch starts at `tripProtects` and continues through
`batchCookingHero`:
`tripProtects`, `outletSafetyHero`, `cordHazards`, `electricalSafetyHero`,
`warningSignsElectrical`, `electricianBoundaryHero`,
`qualifiedElectricianBoundary`, `catTravelBasicsHero`, `catMealPlanningHero`,
`travelBookingHero`, `accommodationChoice`, `travelMoneyDocsHero`,
`documentCopies`, `packingSmartHero`, `carryOnEssentials`, `tripPlanningHero`,
`documentsEarly`, `travelSafetyHero`, `travelSafetyNet`, and
`batchCookingHero`.

### Lesson visual quality redo - electrical/travel/meal bridge

2026-06-30: Completed the next 20 quality-regenerated assets from
`tripProtects` through `batchCookingHero`. This batch covers the remaining
Electrical Safety lesson visuals, Travel Basics category/lesson visuals, the
Meal Planning category hero, and the first Meal Planning lesson visual. All 20
were copied into `assets/images`, normalized to `1672x941`, registered in
`src/constants/images.ts`, and QA'd by contact sheet for no readable text,
letters, digits, labels, logos, UI screenshots, warning labels, travel-document
pseudo text, equation glyphs, or watermarks. Rejected one `catMealPlanningHero`
draft because its coins had markings; accepted a clean retry with plain tokens.
Manifest coverage moved from `299 / 1584` to `319 / 1584`; `1265` assets remain
pending in the quality redo.

Next quality batch starts at `portionFreeze` and continues through
`editingProofreadingHero`:
`portionFreeze`, `groceryShoppingHero`, `listStopsImpulse`,
`weeklyMealPlanHero`, `inventoryMealList`, `reduceFoodWasteHero`,
`useItUpMeal`, `mealPlanningHero`, `decisionFatiguePlan`,
`catClearWritingHero`, `catPersuasionBasicsHero`, `clearWritingHero`,
`clarityOverClevernessHero`, `writingStructureHero`, `mainPointFirstHero`,
`cuttingClutterHero`, `cutFillerHero`, `readerFocusedWritingHero`,
`knowAudienceHero`, and `editingProofreadingHero`.

### Lesson visual quality redo - meal planning/clear writing bridge

2026-06-30: Completed the next 20 quality-regenerated assets from
`portionFreeze` through `editingProofreadingHero`. This batch covers the rest
of Meal Planning, Clear Writing category/lesson visuals, Persuasion Basics
category hero, and the first editing/proofreading writing visual. All 20 were
copied into `assets/images`, normalized to `1672x941`, registered in
`src/constants/images.ts`, and QA'd by contact sheet for no readable text,
letters, digits, labels, logos, UI screenshots, recipe-card/list text, document
pseudo text, equation glyphs, or watermarks. Rejected and regenerated drafts for
`listStopsImpulse` (check/X marks), `weeklyMealPlanHero` (pantry label-like
marks), and `mealPlanningHero` (question mark/phone UI and marked tokens).
Manifest coverage moved from `319 / 1584` to `339 / 1584`; `1245` assets remain
pending in the quality redo.

Next quality batch is the 11-image tail at the end of the current manifest
order:
`editThenProofreadHero`, `persuasionBasicsHero`,
`persuasionVsManipulationHero`, `understandingAudienceHero`,
`audienceMotivationsHero`, `influencePrinciplesHero`, `honestInfluenceHero`,
`convincingCaseHero`, `threeAppealsHero`, `persuasionEthicsHero`, and
`ethicalLineHero`. After that, resume from the remaining pending manifest
entries.

### Lesson visual quality redo - persuasion tail

2026-06-30: Completed the 11-image tail batch from `editThenProofreadHero`
through `ethicalLineHero`. This finishes the current manifest-order
Writing/Persuasion tail. All 11 were copied into `assets/images`, normalized to
`1672x941`, registered in `src/constants/images.ts`, and QA'd by contact sheet
for no readable text, letters, digits, labels, logos, UI screenshots, document
pseudo text, warning labels, equation glyphs, or watermarks. Symbolic
chart/scale/heart/group marks were accepted as pictorial cues, not labels.
Manifest coverage moved from `339 / 1584` to `350 / 1584`; `1234` assets remain
pending in the quality redo.

Next quality batch resumes from the first pending manifest entries:
`catAiBasicsHero`, `catBiologyHero`, `machineLearningHero`,
`trainingExamples`, `responsibleAiHero`, `aiPrivacyReliance`, `aiToolUseHero`,
`iterateVerifyAi`, `aiLimitsHero`, `hallucinationCheck`,
`aiPatternFinderHero`, `patternNotMind`, `dnaGeneticsHero`,
`geneInstructionManual`, `ecosystemHero`, `foodWebConnections`,
`evolutionHero`, `naturalSelectionHero`, `lifeEnergyHero`, and
`photosynthesisHero`.

### Lesson visual quality redo - AI and biology start

2026-06-30: Completed the 20-image AI Basics / Basic Biology start batch from
`catAiBasicsHero` through `photosynthesisHero`. This batch covers AI category
hero art, the first AI lesson visuals, Basic Biology category hero art, and the
first biology lesson visuals for DNA/genetics, ecosystems, evolution, energy,
and photosynthesis. All 20 were copied into `assets/images`, normalized to
`1672x941`, registered in `src/constants/images.ts`, and QA'd by contact sheet
for no readable text, letters, digits, labels, logos, UI screenshots, DNA base
letters, formulas, document pseudo text, or watermarks. Rejected and regenerated
one `responsibleAiHero` draft for a label-like caution mark. Manifest coverage
moved from `350 / 1584` to `370 / 1584`; `1214` assets remain pending in the
quality redo.

Next quality batch resumes with remaining Biology and Animals/Baking:
`biologyLifeHero`, `cellBuildingBlocks`, `catAnimalsHero`, `catBakingHero`,
`animalsEvolutionHero`, `naturalSelectionAnimalsHero`,
`animalClassificationHero`, `nestedAnimalGroupsHero`, `mammalsHero`,
`mammalDiversityHero`, `birdsHero`, `birdsDinosaurLinkHero`,
`reptilesAmphibiansHero`, `reptileAmphibianCompareHero`, `insectsHero`,
`insectSuccessHero`, `oceanLifeHero`, `planktonToWhalesHero`,
`animalCommunicationHero`, and `communicationChannelsHero`.

### Lesson visual quality redo - biology tail and animals start

2026-06-30: Completed the 20-image Biology tail / Animals start batch from
`biologyLifeHero` through `communicationChannelsHero`. This batch covers the
remaining Basic Biology lesson visuals, Animals and Baking category heroes, and
Animals lessons for evolution, classification, mammals, birds, reptiles and
amphibians, insects, ocean life, and communication. All 20 were copied into
`assets/images`, normalized to `1672x941`, registered in
`src/constants/images.ts`, and QA'd by contact sheet for no readable text,
letters, digits, labels, logos, UI screenshots, taxonomy words, measurement
ticks, formula glyphs, document pseudo text, or watermarks. Pictorial trait
icons, waveforms, and signal paths were accepted as lesson cues. Manifest
coverage moved from `370 / 1584` to `390 / 1584`; `1194` assets remain pending
in the quality redo.

Next quality batch continues Animals/Baking:
`animalMigrationHero`, `animalNavigationHero`, `predatorsPreyHero`,
`armsRaceHero`, `endangeredFoodWebHero`, `connectedFoodWebHero`,
`bakingScienceHero`, `bakingChemistryHero`, `breadBasicsHero`, `breadRiseHero`,
`cakesSpongesHero`, `cakeAirLeaveningHero`, `pastryFundamentalsHero`,
`pastryFatLayersHero`, `cookiesBiscuitsHero`, `cookieTweaksHero`,
`chocolateWorkHero`, `chocolateTemperingHero`, `recipeFailHero`, and
`bakingTroubleshootingHero`.

### Lesson visual quality redo - animals remainder and baking science

2026-06-30: Completed the 20-image Animals remainder / Baking Science batch
from `animalMigrationHero` through `bakingTroubleshootingHero`. This batch
covers Animals lessons for migration, predator/prey, endangered food webs, and
Baking lessons for baking science, bread, cakes, pastry, cookies, chocolate, and
recipe failures. All 20 were copied into `assets/images`, normalized to
`1672x941`, registered in `src/constants/images.ts`, and QA'd by contact sheet
for no readable text, letters, digits, labels, logos, UI screenshots,
recipe-card text, thermometer numbers, measurement ticks, warning marks,
formula glyphs, or watermarks. Rejected and regenerated one `cookieTweaksHero`
draft for tiny oven-control markings. Four off-size generated outputs were
normalized. Manifest coverage moved from `390 / 1584` to `410 / 1584`; `1174`
assets remain pending in the quality redo.

Next quality batch continues with Baking decorating/healthier/classic-desserts
and Banking/Cognitive Biases/Body Language starts:
`decoratingBasicsHero`, `simpleDecorationHero`, `healthierBakingHero`,
`smartBakingSwapsHero`, `classicDessertsHero`, `dessertCoreTechniquesHero`,
`catBankingAccountsHero`, `catCognitiveBiasesHero`, `cognitiveBiasHero`,
`shortcutGoneWrongHero`, `commonBiasesHero`, `confirmationAnchoringHero`,
`decisionBiasesHero`, `lossSunkCostHero`, `socialMemoryBiasHero`,
`memoryRewriteHero`, `reducingBiasesHero`, `outsidePerspectiveHero`,
`catBodyLanguageHero`, and `catBordersHero`.

### Lesson visual quality redo - baking tail, biases, body/borders start

2026-07-01: Completed the 20-image mixed batch from `decoratingBasicsHero`
through `catBordersHero`. This batch covers the Baking tail
(decorating/healthier/classic desserts), Banking & Accounts category hero,
Cognitive Biases category and lesson visuals, plus Body Language and Countries
& Borders category heroes. All 20 were copied into `assets/images`, normalized
to `1672x941`, registered in `src/constants/images.ts`, and QA'd by contact
sheet for no readable text, letters, digits, labels, logos, UI screenshots,
recipe-card text, banking-form text, cognitive-bias chart labels, map labels,
country names, flag markings, checkmarks, or watermarks. Rejected and
regenerated one `reducingBiasesHero` draft for a UI-like pause icon. Six
off-size generated outputs were normalized. Manifest coverage moved from
`410 / 1584` to `430 / 1584`; `1154` assets remain pending in the quality redo.

Next quality batch continues Body Language / Countries & Borders:
`bodyLanguageBasicsHero`, `bodyLanguageClustersHero`,
`readingBodyLanguageHero`, `openClosedSignalsHero`, `yourBodyLanguageHero`,
`openConfidenceHero`, `bodyLanguageSettingsHero`, `videoCallBodyLanguageHero`,
`bodyLanguageMythsHero`, `mythsBustedHero`, `countryBasicsHero`,
`countryDefinitionHero`, `bordersDrawnHero`, `naturalArtificialBordersHero`,
`nationStateHero`, `nationVsStateHero`, `changingBordersHero`,
`mapInMotionHero`, `borderConflictHero`, and `selfDeterminationHero`.

### Lesson visual quality redo - body language and borders lessons

2026-07-01: Completed the 20-image Body Language / Countries & Borders lesson
batch from `bodyLanguageBasicsHero` through `selfDeterminationHero`. All 20
were copied into `assets/images`, normalized to `1672x941`, registered in
`src/constants/images.ts`, and QA'd by contact sheet for no readable text,
letters, digits, labels, logos, UI screenshots, speech text, map labels,
country names, flag markings, warning signs, document pseudo text, or
watermarks. Rejected and regenerated one `readingBodyLanguageHero` draft for a
question mark and one `bodyLanguageSettingsHero` draft for a laptop logo.
Pictorial gesture/context icons, arrows, signal arcs, and unlabeled map cues
were accepted as lesson cues. Manifest coverage moved from `430 / 1584` to
`450 / 1584`; `1134` assets remain pending in the quality redo.

Next quality batch starts Business & Entrepreneurship / Career & Work:
`catBusinessEntrepreneurshipHero`, `catCareerWorkHero`, `businessIdeaHero`,
`realProblemHero`, `validatingIdeaHero`, `testBeforeBuildHero`,
`marketResearchHero`, `customerCompetitorHero`, `businessModelHero`,
`valueToMoneyHero`, `businessPlanHero`, `simplePlanCoversHero`,
`pricingProductHero`, `valuePricingHero`, `businessCashFlowHero`,
`profitIsntCashHero`, `bootstrapFundingHero`, `bootstrappingHero`,
`firstHiresHero`, and `outsizedHireImpactHero`.

### Lesson visual quality redo - business start and career category

2026-07-01: Completed the 20-image Business & Entrepreneurship / Career & Work
start batch from `catBusinessEntrepreneurshipHero` through
`outsizedHireImpactHero`. All 20 were copied into `assets/images`, normalized
to `1672x941`, registered in `src/constants/images.ts`, and QA'd by contact
sheet for no readable text, letters, digits, labels, logos, UI screenshots,
business-dashboard labels, finance-form text, CV text, slide-deck text,
currency symbols, chart axes, or watermarks. Rejected and regenerated one
`simplePlanCoversHero` draft for a currency symbol. Pictorial arrows, clocks,
people, blank document blocks, and shield shapes were accepted as lesson cues.
Manifest coverage moved from `450 / 1584` to `470 / 1584`; `1114` assets
remain pending in the quality redo.

Next quality batch continues Business/Career:
`scalingBusinessHero`, `scalingVsGrowingHero`, `startupMistakesHero`,
`biggestPitfallsHero`, `cvPurposeHero`, `interviewDoorHero`,
`cvStructureHero`, `coreCvSectionsHero`, `cvStrongContentHero`,
`resultsNotDutiesHero`, `cvTailoringHero`, `jobDescriptionKeywordsHero`,
`cvMistakesHero`, `cvPresentationErrorsHero`, `freelancingHero`,
`freedomRealityHero`, `findingClientsHero`, `clientPipelineHero`,
`freelancingPricingHero`, and `rateCoversMoreHero`.

### Lesson visual quality redo - business scaling, CV, and freelancing start

2026-07-01: Completed the 20-image Business Scaling / CV / Freelancing start
batch from `scalingBusinessHero` through `rateCoversMoreHero`. All 20 were
copied into `assets/images`, normalized to `1672x941`, registered in
`src/constants/images.ts`, and QA'd by contact sheet for no readable text,
letters, digits, labels, logos, UI screenshots, readable CV/email/profile text,
fake document rows, business-dashboard labels, currency symbols, chart axes, or
watermarks. Rejected and regenerated one `cvTailoringHero` draft for
checklist-style marks and one `freelancingPricingHero` draft for document line
marks. Pictorial arrows, clocks, blank CV blocks, blank role cards, people,
portfolio tiles, and abstract cost tokens were accepted as lesson cues.
Manifest coverage moved from `470 / 1584` to `490 / 1584`; `1094` assets
remain pending in the quality redo.

Next quality batch continues Career Work:
`freelanceContractsPaymentHero`, `contractPaymentProtectionHero`,
`freelancerLifeHero`, `freelanceBoundariesHero`, `interviewsHero`,
`assessmentTwoWayHero`, `interviewPrepHero`, `researchPracticeHero`,
`interviewQuestionsHero`, `behavioralAnswersHero`,
`interviewBodyLanguageHero`, `calmConfidenceHero`, `interviewFollowupHero`,
`followupReflectHero`, `negotiationBasicsHero`,
`conversationNotFightHero`, `negotiationPreparingHero`, `batnaNumbersHero`,
`salaryNegotiationHero`, and `knowWorthHero`.

### Lesson visual quality redo - freelance contracts, interviews, and negotiation start

2026-07-01: Completed the 20-image Freelance Contracts / Interviews /
Negotiation start batch from `freelanceContractsPaymentHero` through
`knowWorthHero`. All 20 were copied into `assets/images`, normalized to
`1672x941`, registered in `src/constants/images.ts`, and QA'd by contact sheet
for no readable text, letters, digits, labels, logos, UI screenshots, readable
CV/email/profile text, contract fine print, calendar numbers, currency symbols,
chart axes, warning labels, or watermarks. Rejected and regenerated
`interviewQuestionsHero` for punctuation-like dot marks, `behavioralAnswersHero`
for a rating-like star, and `salaryNegotiationHero` for list-card rows.
Pictorial shields, locks, clocks, blank cards, speech bubbles, posture cues,
scales, target/path cues, and abstract market bars were accepted as lesson cues.
Manifest coverage moved from `490 / 1584` to `510 / 1584`; `1074` assets remain
pending in the quality redo.

Next quality batch continues Career Work:
`winWinNegotiationHero`, `tradeValueHero`, `negotiationMistakesHero`,
`inMomentErrorsHero`, `networkingHero`, `relationshipDoorsHero`,
`buildingConnectionsHero`, `giveBeforeTakeHero`, `onlineNetworkingHero`,
`strongProfileHero`, `maintainingNetworkHero`, `warmRelationshipsHero`,
`networkingMistakesHero`, `pushyNetworkingHero`,
`workplaceCommunicationHero`, `clarityAudienceHero`, `workEmailHero`,
`readerStructureHero`, `meetingCommunicationHero`, and `speakEffectivelyHero`.

### Lesson visual quality redo - negotiation tail, networking, and workplace communication

2026-07-02: Completed the 20-image Negotiation tail / Networking / Workplace
Communication batch from `winWinNegotiationHero` through `speakEffectivelyHero`.
All 20 were copied into `assets/images`, normalized to `1672x941`, registered in
`src/constants/images.ts`, and QA'd by contact sheet for no readable text,
letters, digits, labels, logos, UI screenshots, readable CV/email/profile text,
social profile UI, email/document pseudo text, currency symbols, chart axes,
warning labels, or watermarks. Rejected and regenerated `onlineNetworkingHero`
for social-profile-style UI rows and `workplaceCommunicationHero` for a
menu/message glyph. Manifest coverage moved from `510 / 1584` to `530 / 1584`;
`1054` assets remain pending in the quality redo.

Next quality batch continues Career Work into Buying a Car / First Aid:
`feedbackCommunicationHero`, `givingFeedbackHero`, `workCommMistakesHero`,
`listeningFailuresHero`, `catBuyingCarHero`, `catFirstAidHero`,
`carBudgetHero`, `beyondStickerPrice`, `newUsedHero`, `depreciationDrop`,
`financingHero`, `totalCostCompare`, `carInspectionHero`,
`independentMechanic`, `carDealHero`, `paperworkSafety`,
`firstAidBasicsHero`, `dangerFirst`, `emergencyCallHero`, and
`locationDetails`.

### Lesson visual quality redo - workplace feedback, buying a car, and first aid start

2026-07-02: Completed the 20-image Workplace Feedback / Buying a Car / First
Aid start batch from `feedbackCommunicationHero` through `locationDetails`. All
20 were copied into `assets/images`, normalized to `1672x941`, registered in
`src/constants/images.ts`, and QA'd by contact sheet for no readable text,
letters, digits, labels, logos, UI screenshots, phone digits, emergency
numbers, medical crosses, license plates, readable paperwork, finance-form
text, currency symbols, price tags, chart axes, warning labels, or watermarks.
Rejected and regenerated `workCommMistakesHero` for a checkmark badge,
`listeningFailuresHero` for a pause glyph, `catBuyingCarHero` for a checkmark
shield, and `newUsedHero` for a checkmark badge. Manifest coverage moved from
`530 / 1584` to `550 / 1584`; `1034` assets remain pending in the quality redo.

Next quality batch continues First Aid into Car Maintenance / Food Safety:
`chokingCprHero`, `cprAedHelp`, `commonFirstAidHero`, `sprainCare`,
`cutsBurnsHero`, `directPressure`, `catCarMaintenanceHero`,
`catFoodSafetyHero`, `carMaintenanceHero`, `ownerManualGold`,
`routineChecksHero`, `walkaroundCheck`, `fluidCheckHero`, `dipstickOil`,
`tireCareHero`, `pressureTread`, `warningLightsHero`, `redAmberCode`,
`foodSafetyHero`, and `cleanSeparateCookChill`.

### Lesson visual quality redo - first aid tail, car maintenance, and food safety start

2026-07-02: Completed the 20-image First Aid tail / Car Maintenance / Food
Safety start batch from `chokingCprHero` through `cleanSeparateCookChill`. All
20 were copied into `assets/images`, normalized to `1672x941`, registered in
`src/constants/images.ts`, and QA'd by contact sheet for no readable text,
letters, digits, labels, logos, UI screenshots, phone digits, emergency
numbers, medical crosses, visible blood, gore, license plates, dashboard
labels, real warning icons, thermometer numbers, fake manual text, packaging
text, chart axes, or watermarks. Rejected and regenerated `cutsBurnsHero` for
visible wound/burn detail and `catFoodSafetyHero` for raw protein and
vegetables sharing one board. Manifest coverage moved from `550 / 1584` to
`570 / 1584`; `1014` assets remain pending in the quality redo.

Next quality batch continues Food Safety into Chemistry / Electricity:
`temperatureSafetyHero`, `dangerZone`, `foodStorageHero`, `rawMeatBottom`,
`spoilageHero`, `sensesAndDates`, `crossContaminationHero`,
`separateBoards`, `catChemistryHero`, `catElectricityScienceHero`,
`everydayChemistryHero`, `kitchenChemistry`, `moleculesCompoundsHero`,
`compoundNewProperties`, `periodicTableHero`, `periodicPatterns`,
`chemicalReactionHero`, `reactionSigns`, `atomsHero`, and `insideAtom`.

Quality redo started with the active **Cooking & Food + Home & Car** batch. The
first accepted replacements are `cleaningBasicsHero`, `cookingTechniqueHero`,
`heatFamilies`, `cookingMistakesHero`, `hotPanCrowding`, `dryHeatHero`,
`browningMagic`, `moistHeatHero`, `boilSimmer`, `seasoningHero`, and
`flavorBalance`. Cleaning & Upkeep is now complete too: `cleaningBasicsHero`,
`topToBottomFlow`, `routineHero`, `taskFrequency`, `declutterHero`,
`keepDonateDiscard`, `hygieneHotspotsHero`, `cleanThenDisinfect`,
`essentialKit`, and `neverMixCleaners`. Car Maintenance is now complete too:
`carMaintenanceHero`, `ownerManualGold`, `routineChecksHero`, `walkaroundCheck`,
`fluidCheckHero`, `dipstickOil`, `tireCareHero`, `pressureTread`,
`warningLightsHero`, and `redAmberCode`. Basic Home Repairs is now complete too:
`maintenanceHero`, `preventiveFix`, `diyProHero`, `callProBoundary`,
`wallPatchHero`, `patchSandPaint`, `doorFixHero`, `hingeLatchAlignment`,
`leakStopHero`, and `findLeakSource`. Continue from
`image-pipeline/quality-regeneration-progress.md`.

### Loose ends / revisit

- Before continuing the image quality redo, confirm the next target batch in
  `image-pipeline/quality-regeneration-progress.md` and whether the user already
  has a marked bad-image list. Money & Finance and Mindfulness remain the
  reference quality bar; avoid replacing accepted pilot visuals.
- Confirmed continuation point: the next image quality redo batch is listed
  under `image-pipeline/quality-regeneration-progress.md` -> "Next Action".
  The Freelance Contracts / Interviews / Negotiation start batch was replaced and QA'd.
  Continue automatically with the next 20 pending manifest entries starting at
  `winWinNegotiationHero` and ending at `speakEffectivelyHero`.
- Windows blocked direct `.ps1` execution for
  `image-pipeline/render-internet-passwords.ps1` and
  `image-pipeline/render-scams-privacy.ps1`, plus
  `image-pipeline/render-ai-biology.ps1` and
  `image-pipeline/render-chemistry-electricity.ps1`, plus
  `image-pipeline/render-physics-weather.ps1`, plus
  `image-pipeline/render-space-body.ps1`, plus
  `image-pipeline/render-nutrition-exercise.ps1`, plus
  `image-pipeline/render-sleep-mental.ps1`, plus
  `image-pipeline/render-medicines-brain.ps1`, plus
  `image-pipeline/render-respiratory-hormones.ps1`, plus
  `image-pipeline/render-muscles-nervous.ps1`, plus
  `image-pipeline/render-heart-digestive.ps1`, plus
  `image-pipeline/render-senses-immune.ps1`, plus
  `image-pipeline/render-genetics-reproduction.ps1`, plus
  `image-pipeline/render-space-deep-planets-sun.ps1`, plus
  `image-pipeline/render-space-deep-blackholes-bigbang.ps1`, plus
  `image-pipeline/render-space-deep-galaxies-life.ps1`, plus
  `image-pipeline/render-space-deep-history-telescopes.ps1`, plus
  `image-pipeline/render-space-deep-eclipses-future.ps1`, plus
  `image-pipeline/render-space-deep-moon-tides.ps1`, plus
  `image-pipeline/render-animals-baking.ps1`, plus
  `image-pipeline/render-banking-biases.ps1`, plus
  `image-pipeline/render-body-borders.ps1`, plus
  `image-pipeline/render-business-career.ps1`, plus
  `image-pipeline/render-listening-conflict.ps1`, plus
  `image-pipeline/render-writing-persuasion.ps1`, plus
  `image-pipeline/render-speaking-relationships.ps1`, plus
  `image-pipeline/render-coding-creative-writing.ps1`, plus
  `image-pipeline/render-design-earth.ps1`, plus
  `image-pipeline/render-energy-economics.ps1`, plus
  `image-pipeline/render-film-futuretech.ps1`, plus
  `image-pipeline/render-government-history.ps1`, plus
  `image-pipeline/render-howworks-languages.ps1`, plus
  `image-pipeline/render-law-logic.ps1`, plus
  `image-pipeline/render-marketing-math.ps1`, plus
  `image-pipeline/render-medicine-money.ps1`, plus
  `image-pipeline/render-music-data.ps1`, plus
  `image-pipeline/render-final-remaining.ps1`, under the current execution
  policy. The script works when invoked with:
  ```powershell
  $script = Get-Content -Raw .\image-pipeline\<script-name>.ps1
  Invoke-Expression $script
  ```
  Keep this in mind if rerendering those batches.
- The later batches use deterministic local static PNG generation because the
  image generation tool was unreliable about persisting files. These are now
  explicitly considered placeholders for the quality reset, except for the
  Money & Finance and Mindfulness pilot visuals. Do not use the deterministic
  render scripts as final-art generation for the redo pass.
- Latest validation note: `npm run lint` passes cleanly, and
  `npx tsc --noEmit` now passes cleanly too. Keep using `npx tsc --noEmit`
  while there is no dedicated `typecheck` script in `package.json`.
- Latest image-redo validation attempt: `npm.cmd run lint` currently fails
  because `expo` is not recognized from this checkout, and
  `npx.cmd tsc --noEmit` fails because `typescript` is not installed locally
  and `npx` resolves the unrelated `tsc` package. Do not install dependencies
  without user approval; rerun validation after the project toolchain is
  restored.

## Gamification (coins / XP / streak + Progress screen)

### 1. Streak flame: always pulsing vs. only on a new streak day  ⬅️ main one

- **Where:** `src/components/stats/StreakBadge.tsx`
- **Current:** the flame *breathes continuously* (`usePulse(streak > 0)`) **and**
  punches harder on the day the streak ticks up (`usePopOnIncrease`). The two are
  combined with `Animated.multiply(pulse, pop)`.
- **Why I chose it:** a gently living flame reads as "your streak is burning" and
  fits the "playful, polished" quality bar (Duolingo-style).
- **Possible concern:** a perpetual pulse in the home header could feel busy
  while scrolling.
- **Alternative:** pulse **only when the streak increments** (pure reward feedback).
- **How to switch to "only on activation":** in `StreakBadge.tsx`, drop the pulse
  and use the pop alone:
  ```tsx
  // remove: const pulse = usePulse(streak > 0);
  const pop = usePopOnIncrease(streak, 1.4);
  const flameScale = pop;            // was: Animated.multiply(pulse, pop)
  ```
  (You can then delete the now-unused `usePulse` import.)
- **Tweak instead of remove:** keep continuous but make it subtler/slower in
  `src/hooks/animations.ts` → `usePulse` defaults (`max: 1.12`, `duration: 900`).

### 2. XP→level curve shape

- **Where:** `src/store/progress.ts` (`BASE_LEVEL_XP = 100`, `LEVEL_STEP = 20`).
- **Current:** gentle progressive curve — level 1→2 = 100 XP, then +20 each level
  (120, 140, …). Replaced the old flat "every 100 XP".
- **Revisit:** is the ramp too shallow/steep? Tune the two constants. `LEVEL_STEP = 0`
  gives back a flat curve.

### 3. Reward amounts (XP / coins)

- **Where:** `src/app/lesson/[id].tsx` (`XP_PER_CARD = 5`) and
  `src/components/lesson/QuizRound.tsx` (`XP_PER_QUESTION = 10`,
  `COINS_PER_QUESTION = 5`).
- **Current:** these were set in an earlier step; I kept them. First-time only —
  re-reading a finished lesson grants nothing.
- **Revisit:** balance against the daily goal (`DAILY_GOAL_XP = 20` in
  `src/store/progress.ts`) and the level curve once there's more content.

### 4. "Total XP" tile on the Progress screen

- **Where:** `src/app/(tabs)/progress.tsx` (third completion tile).
- **Current:** shows lifetime XP. It's an **extra** — the task only required level
  + XP bar, streak, coins, and lessons/cards completed.
- **Revisit:** keep for a fuller dashboard, or drop it and let the two remaining
  tiles (Lessons / Cards) go wider.

### 5. Coins & streak shown as header pills (not big tiles)

- **Where:** `src/app/(tabs)/progress.tsx` header uses `<StreakBadge />` +
  `<CoinBalance />`; `XPBar` lives in the level card.
- **Current:** reuses the three header components (the task asked to reuse them),
  consistent with the home header.
- **Revisit:** if the Progress screen should *celebrate* coins/streak more, promote
  them to large stat tiles too (would duplicate the header pills).

### 6. Streak keyed to the device clock (known MVP limitation)

- **Where:** `src/store/progress.ts` (`todayKey` / `yesterdayKey`, already commented).
- **Current:** streak uses the device's local date — a user can fake it by changing
  the clock, and timezone shifts can move the date.
- **Revisit:** acceptable offline; validate against server time if/when a backend exists.

### 7. Animated progress bar is opt-in

- **Where:** `src/components/ProgressBar.tsx` (`animated` prop, default `false`).
- **Current:** XP bar and topic bars pass `animated`; the home daily-goal bar and
  the quiz bar still snap (unchanged).
- **Revisit:** could also animate the daily-goal bar on XP gain for consistency.

---

## Ads / Monetization (AdMob)

> **Update (prompt 24 — go-live swap done):** `react-native-google-mobile-ads`
> is now **installed**, the config plugin is in `app.json`, and `src/lib/ads.ts`
> now runs the **real SDK outside Expo Go** and the stub inside (same lazy
> pattern as `lib/purchases.ts`). Expo Go still works. What's left is yours:
> paste real IDs/keys, rebuild the dev client, and verify on device — see
> **"Monetization go-live (prompt 24)"** at the bottom of this file for the
> exact remaining steps. The notes below describe the original stub design and
> the still-relevant guardrails.

Ads were **stubbed for Expo Go** (`src/lib/ads.ts`) so the whole app runs end to
end with no dev client. The four-function API (`loadInterstitial`,
`showInterstitial`, `loadRewarded`, `showRewarded`) and the Pro-gate +
coin-crediting wiring (`src/hooks/ads.ts`) are in place; going live is just
swapping the stub bodies and dropping in real IDs.

### ✅ Actions for you (pre-launch — do these in order)

These are the steps only you can do; I left the code ready for each.

- [ ] **AdMob account + app** — register the Android app in the AdMob console,
      grab the **App ID** (`ca-app-pub-XXXXXXXX~YYYYYYYY`, the one with `~`).
- [ ] **Create 2 ad units** — one **Interstitial**, one **Rewarded** — and copy
      their **unit IDs** (`ca-app-pub-XXXXXXXX/ZZZZZZZZ`, the ones with `/`).
- [ ] **Set the rewarded reward** on the rewarded unit in the console (the coin
      amount). The app credits whatever the verified callback returns, so this is
      the real source of truth — `REWARDED_COIN_REWARD = 50` is only the button
      label until then.
- [ ] **Install the module** (only when you're ready to leave Expo Go — this is
      what forces a dev build):
      ```bash
      npx expo install react-native-google-mobile-ads
      ```
- [ ] **Add the config plugin** to `app.json` → `expo.plugins` (use your **App
      ID**; the value below is Google's *test* app ID, fine for first builds):
      ```json
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-3940256099942544~3347511713"
        }
      ]
      ```
- [ ] **Fill real unit IDs** in `src/lib/ads.ts` → `PROD_AD_UNIT_IDS`
      (`interstitial` + `rewarded`). Leave `TEST_AD_UNIT_IDS` as-is.
- [ ] **Swap the stub bodies** for the real SDK — every spot is marked with a
      `REAL:` comment in `src/lib/ads.ts` (load/show for both formats).
- [ ] **Build a dev client / EAS build** — Expo Go cannot run native ads:
      ```bash
      npx expo run:android      # local dev client
      # or: eas build --profile development --platform android
      ```
- [ ] **Test with Google test IDs on the dev client first**, then ship real IDs.
- [ ] **(EEA/UK compliance)** add a consent flow (Google UMP SDK) before serving
      ads to European users — AdMob requires it.

### 🔒 Guardrails already coded (so you remember they're handled)

- **Expo Go stays working** until you swap — the stub imports nothing native.
- **Pro users see no ads** — gated in `src/hooks/ads.ts` (`isPro` short-circuits
  both `showLessonInterstitial` and `watchRewardedForCoins`).
- **Coins credited only on the verified reward** — `showRewarded(onReward)` →
  `addCoins` in the progress store. Never on ad open.
- **Interstitials only between lessons** — fire on leaving the completion screen
  (`closeFromComplete` in `src/app/lesson/[id].tsx`), never mid-lesson/on launch.
  Cap = every **2nd** completion + a **60s** min gap between *any* two ads
  (`LESSONS_PER_INTERSTITIAL`, `MIN_AD_GAP_MS` in `src/lib/ads.ts`) — that gap is
  what stops a rewarded ad and an interstitial stacking on the same screen.
- **Never ship test IDs / no IDs** — `adUnitId()` returns test IDs in `__DEV__`
  and **throws in a release build** if `PROD_AD_UNIT_IDS` is empty.

### Decisions to revisit (sensible defaults I picked)

- **Rewarded button placement** — `src/components/lesson/LessonComplete.tsx`
  shows a "Watch a quick ad for +N coins" button to free users on the lesson
  finish screen. It's the natural between-lessons moment; move/duplicate it (e.g.
  a coins/store area) if you want another earn surface.
- **Cap aggressiveness** — every 2nd lesson is gentle for a micro-learning feed.
  Tune `LESSONS_PER_INTERSTITIAL` / `MIN_AD_GAP_MS` once you see session lengths.
- **Reward size** — `REWARDED_COIN_REWARD = 50` vs. quiz coins
  (`COINS_PER_QUESTION = 5`); balance so ads feel worth it without trivializing
  earned coins.

---

## Coin sink / category unlock (prompt 21)

Spend-to-unlock for coin-locked categories — the counterpart to the rewarded-ad
earn flow. Coins now matter: a locked category opens `UnlockCategoryModal`
(`src/components/UnlockCategoryModal.tsx`) from its cost badge.

- **Store:** `unlockedCategoryIds` + `unlockCategory(id, cost)` in
  `src/store/progress.ts`. It reuses `spendCoins` (so the negative-amount guard +
  balance check live in one place), is idempotent, and treats Pro as
  "everything unlocked" without spending. Persisted in the same `joat:progress`
  key; `reset()` clears it. Unlock is keyed by **category slug**.
- **Gating:** Explore category blocks + search results route locked lessons to
  the unlock sheet; category-selection routes a locked tile there (and
  auto-selects it on success); the lesson reader (`lesson/[id].tsx`) has a
  `LessonLocked` safety-net gate for deep-links / resume.
- **Short on coins:** the sheet offers the rewarded-ad earn flow
  (`hooks/ads.ts`, placement `category_unlock`). After watching, the balance
  updates live and the user taps **Unlock** (deliberate re-check, not auto-spend).

### Loose ends / revisit

- **Dormant until locked categories get content.** Only `history` + `safety`
  carry a `coinCost` today and neither has markdown yet (nor a `CATEGORY_TO_SLUG`
  mapping in `lib/feed.ts`). So the whole unlock→access path is wired but not
  reachable until that content lands and is mapped — at which point it works with
  no code change. Verify the flow then.
- **Unlock price** lives in the catalog (`src/data/topics.ts`, `coinCost: 100`).
  Tune per category once the economy (earn rates vs. prices) is tested.
- **New analytics placement** `category_unlock` flows through the existing
  `ad_watched` event — no new event added.

---

## Stub affordances finished (prompt 22)

The two remaining no-op controls now do something real — no dead controls ship.

### 1. Home notification bell → notifications panel

- **Chose:** *implement*, not remove. The bell opens a real announcements panel
  (`src/app/notifications.tsx`, a modal registered in `src/app/_layout.tsx`) fed
  by a **typed static list** (`src/data/announcements.ts`) — no backend, no push,
  consistent with the no-database rule. When announcements ever come from a
  server, only the data file moves; the screen stays.
- **Loose ends / revisit:**
  - **No unread badge.** Deliberately skipped the "blue dot" — it needs persisted
    "last seen" state (AsyncStorage in the progress store). Add a
    `lastSeenAnnouncementAt` and a dot on the bell if you want unread affordance.
  - **`postedLabel` is relative with an absolute fallback.** Seed dates are
    static, so within ~8 weeks notes read "Nd / Nw ago", then fall back to
    "Mon D". Swap the seed dates (or wire a real `publishedAt`) when content is
    real; the formatter doesn't change.
  - **Copy is honest to current behavior** (Pro, coins/unlock, streaks, pilot
    categories). Update the list as features land.

### 2. Category-selection search → live filter

- **What:** the search box is now a real `<SearchField>` (the same shared input
  Explore uses) that **live-filters the grid** by category title **plus** the
  category's inner topic ("subtopic") titles from the content index
  (`src/data/index.ts`). The match uses the shared `filterByQuery`
  (`src/lib/search.ts`) — the *identical* helper Explore (prompt 19) already
  uses, so both search surfaces behave the same.
- **Loose ends / revisit:**
  - **Inner-topic matching only covers categories that have content.** Today only
    `money` + `mindfulness` are mapped (`CATEGORY_TO_SLUG` in `lib/feed.ts`), so
    only they match on subtopic titles; the rest match on their catalog title
    only. They start matching deeper automatically as content + mappings land.
  - **"See all categories" is still a visual-only button** (hidden during an
    active search). It's out of scope here — there's no full 60+ catalog yet; the
    placeholder copy ("Search 60+ categories") is aspirational. Wire it when the
    full catalog exists.

---

## Quiz answer persistence (prompt 23)

- **Chose:** *wire it* (not delete). `QuizRound.tsx` now records each selection
  via `answerQuiz` and seeds its per-question answers from the store's
  `quizAnswers` on mount, so reopening a lesson shows prior results instead of a
  blank quiz. No more dead store state.
- **Reward safety:** restored answers are seeded straight into state and never
  re-run `choose`, so they can't re-fire a reward — first-time-only logic is
  unchanged. This also closed a pre-existing farming hole: before, leaving a quiz
  mid-way and returning lost local state, so you could re-answer Q0 (with
  `rewardsEnabled` still true) and get re-rewarded. Restored answers now block
  that. Reward **chips** are suppressed on restored answers so a resumed quiz
  never implies a fresh earn.
- **Loose ends / revisit:**
  - **Completion summary is per-session.** `earned.current` in
    `app/lesson/[id].tsx` resets each mount, so if you answer part of a quiz,
    leave, then return and finish, the completion screen shows only this
    session's XP/coins (the store balance is still correct). Fine for v1; revisit
    if the summary should reflect lifetime earnings for that lesson.
  - **Resume starts at Q1, not the first unanswered question.** Reopening a
    partially-answered quiz shows Q1 (with its restored result) and you page
    forward. Could auto-jump to the first unanswered question later; low value
    for short quizzes.

---

## Monetization go-live (prompt 24)

The **code** is done. Both `lib/ads.ts` (AdMob) and `lib/purchases.ts`
(RevenueCat) now run the **real native SDK outside Expo Go** and fall back to a
stub inside Expo Go, so the app still runs in Expo Go with no dev client. The
policy (Pro = no ads, rewarded credit only on the verified callback, interstitial
cap + 60s gap, fail-open entitlements) is unchanged. What remains needs your
accounts, real keys, a dev/release build, and a device — only you can do these.

### ✅ Verification pass (2026-07-14)

Re-audited the whole go-live wiring end to end on this checkout; nothing new to
write in code — the swap was already complete. Confirmed:

- **Native modules installed:** `react-native-google-mobile-ads@16.3.4`,
  `react-native-purchases@10.3.0`, `expo-dev-client@56.0.20` all in
  `package.json`. No `REAL:` markers remain in `src/lib/*.ts` — the real-SDK
  bodies are fully swapped (the only surviving `REAL:` strings are in the prompt
  archive + this file's prose).
- **AdMob config plugin actually applies:** `npx expo config --type introspect`
  resolves `react-native-google-mobile-ads`, injects the `APPLICATION_ID`
  meta-data into the Android manifest, and carries the real
  `androidAppId` `…9738~8547378898`. (VS Code may show an
  "Unexpected token 'typeof' — not a valid config plugin" warning on `app.json`
  — that's a **false positive** from the editor's static validator; the compiled
  plugin `require()`s fine and the resolver above proves it works.)
- **Removed a stray test ID:** `app.json` had `iosAppId` set to Google's TEST
  iOS app id on this Android-only app. Deleted it (dead config + a test id; iOS
  is never built here). `androidAppId` is the only one that matters.
- **Policy paths confirmed in code (not just claimed):** interstitial fires only
  from `closeFromComplete` (leaving the completion screen) in
  `app/lesson/[id].tsx` — never mid-lesson; rewarded button is hidden for Pro
  (`onWatchAd={isPro ? undefined : watchRewardedForCoins}`) and coins credit only
  inside the `showRewarded` verified-reward callback; `initPurchases()` runs at
  app launch in `app/_layout.tsx` and fails open.
- **eas.json ready:** `development` profile is `developmentClient: true` +
  internal APK (the dev-client build), `production` is an app-bundle.
- **Green:** `npx tsc --noEmit` clean, `expo lint` clean, `28/28` jest tests pass.

**Still only-you (unchanged, needs accounts/hardware):** run the dev-client build
(`eas build --profile development --platform android` or `npx expo run:android`),
verify on a physical device, and paste `PROD_REVENUECAT_ANDROID_KEY` (`goog_…`)
at Play submission. See the tables/checklists below.

### 🔑 Keys/IDs

| Value | Where it goes | Status |
| --- | --- | --- |
| **AdMob App ID** `ca-app-pub-9884769028779738~8547378898` | `app.json` → plugins → `react-native-google-mobile-ads` → `androidAppId` | ✅ set |
| **Interstitial unit ID** `ca-app-pub-9884769028779738/9851592404` | `src/lib/ads.ts` → `PROD_AD_UNIT_IDS.interstitial` | ✅ set |
| **Rewarded unit ID** `ca-app-pub-9884769028779738/5112406621` | `src/lib/ads.ts` → `PROD_AD_UNIT_IDS.rewarded` | ✅ set |
| **Rewarded coin reward** (number set on the AdMob unit) | `src/lib/ads.ts` → `REWARDED_COIN_REWARD` | ✅ `50` (matches the AdMob unit; label only — verified callback is truth) |
| **RevenueCat Test Store key** (`test_…`) | `src/lib/purchases.ts` → `TEST_REVENUECAT_ANDROID_KEY` | ✅ set (dev only; verifies purchase/restore on a dev build with no Play products) |
| **RevenueCat Android public key** (`goog_…`) | `src/lib/purchases.ts` → `PROD_REVENUECAT_ANDROID_KEY` | ⏳ still empty — paste before a release build |

All of these are client-side / non-secret by design (AGENTS.md). The release
guardrails throw if PROD ad IDs or the RevenueCat key are missing in a release
build, so we can't accidentally ship without them, and `__DEV__` keeps TEST ad
IDs in dev. **AdMob App approval status is "Requires review"** in the console —
real ads may not fill until Google approves the app (test ads work meanwhile).

### ✅ Dashboard setup (you)

- **AdMob:** register the Android app (`com.jackofalltrades.app`), create an
  **Interstitial** + a **Rewarded** unit, and set the rewarded reward amount
  (the verified callback is the real source of truth; `REWARDED_COIN_REWARD` is
  only the button label).
- **RevenueCat + Play Console:** create the Pro product (`joat_pro`), an
  entitlement with id **`pro`** (matches `PRO_ENTITLEMENT_ID`), and a current
  offering whose first package is Pro. Copy the **Android public SDK key**.

### 🏗️ Build & verify (you — I can't run EAS or test on hardware)

1. **Rebuild the dev client** so the new ad module is in the binary:
   `eas build --profile development --platform android` (or `npx expo run:android`).
   Until you rebuild, the existing dev client lacks the ad module — `lib/ads.ts`
   try/catches the require and falls back to the stub, so it won't crash, but you
   won't see real ads until the rebuild.
2. **Verify on device:** Pro removes all ads; rewarded coins credit **only** on
   completion (close without watching = no coins); interstitials fire **only**
   between lessons, respect the every-2nd-completion cap + 60s gap, never on
   launch/mid-lesson; purchase **and** restore work; airplane-mode (store
   unreachable) never blocks the app (fail-open to free).
3. **Ship real IDs only in release.** Leave the TEST ad IDs for dev; never ship
   test IDs, never ship without IDs.

### 🛒 RevenueCat production purchases (Google Play) — DEFERRED to submission

The Test Store `test_` key covers dev. The real `goog_…` production key only
works end-to-end once an app + product exist on Play, so this whole block is
parked until the actual Play submission (user HAS a Play developer account, so
it's all unblocked whenever you want to do it). Order:

- **Can do anytime (one-time, reusable):**
  1. **Google Cloud Console** → enable **Google Play Android Developer API**;
     **IAM → Service Accounts → Create** → **Keys → Add key → JSON** (downloads
     the Service Account Credentials JSON RevenueCat asks for).
  2. **Play Console → Setup → API access** → grant that service account
     *View financial data* + *Manage orders and subscriptions*.
  3. **RevenueCat** → Google Play app → package `com.jackofalltrades.app` +
     upload the JSON → Save. Then create entitlement **`pro`**, product
     **`joat_pro`**, and a current **Offering** (first package = `joat_pro`).
- **Needs a build first (the submission step):**
  4. **Play Console** → create app (package `com.jackofalltrades.app`) → upload a
     release AAB (`eas build -p android --profile production`) to ≥ internal
     testing (a build with the package + signing must exist before managed
     products can be created).
  5. Create the **`joat_pro`** managed in-app product (price, etc.).
  6. Grab the **`goog_…`** key (RevenueCat → Project settings → API keys for the
     Google Play app) → paste it into `PROD_REVENUECAT_ANDROID_KEY` in
     `src/lib/purchases.ts`. The release guardrail throws until it's set.

### ⚠️ Still open (carried over)

- **(EEA/UK) consent flow** (Google UMP SDK) before serving ads to European
  users — AdMob requires it. Not wired yet.
- **Locked-category content** (`history`, `safety`) still has no markdown, so the
  coin-unlock path remains dormant until that lands (see "Coin sink" above).
- **AdMob production `goog_` for ads not needed** — ad unit IDs are already set;
  AdMob app is in "Requires review", real ads fill once Google approves.

---

## Launch config cleanups (prompt 25)

Small pre-launch hygiene — all done, one thing to be aware of:

- **Splash + adaptive icon rebranded to ink** (`#0F1320`) in `app.json` — were
  off-brand blue (`#208AEF` / `#E6F4FE`). ⚠️ **You won't see this in Expo Go** —
  Expo Go uses its own icon/splash. The branded splash + icon only apply in a
  **dev client / standalone build**, so verify after the next `eas build`.
- **Removed `ios.icon`** from `app.json` (Android-only app; the path was wrong).
- **"Reset progress" control is now `__DEV__`-only** (`app/(tabs)/profile.tsx`) —
  compiled out of release builds, so it can't be reached by users. Still there in
  dev for testing the category gate.
- **README rewritten** to document JOAT (stack, structure, Expo Go run, content
  pipeline, monetization go-live).
- **Tightened `SocialAuthButtons` types** — `logo: ImageSourcePropType`,
  `style?: StyleProp<ViewStyle>` (were `number` / `object`).

---

## Tests (prompt 26)

First test pass — pure logic only, device/network-free. Run with `npm test`.

- **Runner:** `jest-expo` (approved). Config in `jest.config.js`; `jest.setup.js`
  forces `__DEV__` on and mocks AsyncStorage; `jest/mdStub.js` stubs `.md`
  imports to `""` (parser tests feed crafted strings).
- **Added `babel.config.js`** (`babel-preset-expo`) — Jest's `babel-jest` needs
  one. This just makes explicit what Metro already applied by default, so app
  bundling is unchanged. ⚠️ If the app ever fails to bundle after this, that file
  is the first suspect, but it mirrors the Metro default (TS + Reanimated
  transforms included).
- **Coverage (28 tests):**
  - `lib/content.ts` via the newly-exported `parseLesson` — frontmatter +
    number coercion, `## Card:` splitting, `image:` stripping (known/unknown
    key + the dev warning), `## Quiz` parsing (correct-answer marker,
    explanation), the no-correct / multiple-correct dev warnings, and malformed
    edge cases (no frontmatter, empty card, no quiz).
  - `store/progress.ts` — XP→level curve boundaries (0/99/100/219/220, negative
    clamp), streak `bumpStreak` (same-day no-op, consecutive +1, gap → 1) and
    `reconcileOnLaunch` (alive today/yesterday kept, gap → 0, level resync), the
    negative-amount coin guards, and `selectTodayXp` day-rollover.
- **Test globals** come from `@jest/globals` (explicit imports) rather than
  ambient `@types/jest`, which sidestepped a `jest` namespace/value type clash
  under TS 6 and keeps `tsconfig` untouched.

### Loose ends / revisit

- **Pure-logic only by design** — no component/render tests (would need
  `react-test-renderer` + more setup). Add those later if the UI logic warrants.
- `@types/jest` is `^30` against jest `29`; harmless here since globals come from
  `@jest/globals`, but align them if you add ambient-typed test utilities.

---

## Asset ingest hardening (prompt 27)

The bundled lesson images grew to **~175 MB** (411 PNGs, avg ~470 KB, some >1 MB)
— over a sane APK size (Play's base APK limit is 150 MB). The per-image weight is
the problem: the lesson card renders the visual at ~363×210 dp (≈1080 px @3×), so
~1024 px PNGs are oversized and inefficiently encoded.

Tooling + the CDN switch are in place; the actual compression run is **deferred**
(see why below).

### Compression / resize ingest script

- `image-pipeline/optimize-lesson-images.js` (uses `sharp`, a build-time
  devDependency — never shipped). Resizes each lesson image to ≤1080 px longest
  side and re-encodes to **WebP q80** with a per-image ceiling (steps quality
  down if a file exceeds ~150 KB). Repeatable + idempotent.
- **Measured dry run: 175.4 MB → 5.2 MB (97% smaller, 170 MB saved).** Flat
  illustrations compress dramatically; visual quality is effectively unchanged.
- Run it as the **final ingest pass before a build**:
  ```bash
  node image-pipeline/optimize-lesson-images.js            # dry run (default)
  node image-pipeline/optimize-lesson-images.js --write    # convert + delete PNG + rewrite imports
  ```
  `--write` (without `--keep-png`) also rewrites the lesson `import … .png` paths
  in `src/constants/images.ts` to `.webp`, so every key still resolves.

### Why the conversion is deferred (run it yourself when ready)

- The 411 PNGs are **untracked** (no git safety net) but **regenerable** from the
  `render-*.ps1` scripts; `images.ts` is git-tracked, so a `--write` run is
  reversible.
- You're **still mid-pipeline** (batches ongoing, count grew 379 → 411). The
  optimizer is destructive (replaces PNG→WebP) and your render scripts emit PNG,
  so converting now would mix the pipeline state. Run `--write` **once the image
  library is complete**, right before building. (Then update
  `lesson-visual-manifest` — it will track `.webp` after.)

### Bundled → CDN switch (wired, off by default)

- `src/constants/images.ts` is the single resolution point: `resolveLessonImage(key)`
  returns the bundled asset normally, or `<base>/<key>.webp` when
  `EXPO_PUBLIC_LESSON_CDN_BASE` is set (`lessonImagesAreRemote` flips accordingly).
  `FeedImage` resolves through it — `expo-image` fetches + caches remote URLs with
  no other code change. To flip: upload the optimized WebP set (named by image
  key) to a static CDN and set the env var.

### 📍 Flip point (decision)

- **Stay bundled** while the **compressed** lesson set is small. After WebP it's
  ~5 MB for 411 images (~13 KB each), so the library can grow into the **thousands**
  of images before it matters.
- **Move to the CDN when the *compressed* bundled lesson images exceed ~50 MB**
  (keeps the APK comfortably under Play's 150 MB alongside the JS bundle + native
  libs). That's the trigger to set `EXPO_PUBLIC_LESSON_CDN_BASE` — not the raw
  PNG total, which is why compression comes first.
- ⚠️ Until you run `--write`, the **uncompressed ~175 MB is still bundled** — do
  the compression pass before any production build.

---

## Lesson exposure — full pilot (all 58 bundled lessons live)

All 58 bundled `content/` lessons (48 Money & Finance + 10 Mindfulness) now have
their visuals **wired into the markdown + registered** in `constants/images.ts`,
so `PILOT_LESSON_IDS` (`src/lib/content.ts`) was expanded **18 → 58** to expose
the full set. Previously only the 18 "intro" lessons were surfaced; the 40 deeper
finance lessons were parsed-but-hidden behind the pilot gate. Verified: every
pilot id matches a bundled lesson (no typos/dupes), and both categories map to a
feed slug in `lib/feed.ts`, so they appear in the home feed (one rep per topic)
and Explore (browse-by-category, all lessons).

### Revisit

- **Curated launch?** If you'd rather ship a smaller, hand-picked set first, trim
  `PILOT_LESSON_IDS` back down — it's the single switch. Keep it in sync with
  `RAW_LESSONS` (add an id when a newly-bundled lesson's visuals are ready).
- **Only finance + mindfulness have lesson content.** The image library covers
  ~740 planned lessons across many categories, but `content/` only has these two
  categories' markdown (58 files). The other categories' images are future
  content — they need markdown before they can be exposed.
- Image wiring itself is handled by your pipeline's Primer→content sync; the app
  side just needed the gate lifted.

---

## Full content integration — 740 lessons / 44 categories

Brought the **entire** lesson library into the app (was 58 lessons / 2 categories).

### Generated, data-driven (run `node scripts/build-content.js` after any Primer change)

- **`scripts/build-content.js`** is the single source of wiring. It (1) copies all
  740 Primer `*.md` (`…/Primer/MD Files for topics`) into `content/`, (2) writes
  **`src/lib/lessons.generated.ts`** (the 740 static `.md` imports + `RAW_LESSONS`),
  and (3) writes **`src/data/categories.ts`** — the data-driven category catalog
  (44 entries: slug, title, hero `icon`, accent color, lessonCount).
- Each category's visual **reuses its intro lesson's hero illustration**; colors
  come from a 16-entry palette (money/mindfulness pinned). All free (no `coinCost`).

### What changed app-side (kept low-churn)

- `theme` now **re-exports** `categoryColors` + `CategorySlug` from
  `@/data/categories` (so existing `@/theme` imports are unchanged). `CategorySlug`
  is now `string` (data-driven, not an 8-member union).
- `@/data/topics` re-exports `categories`/`Category` from `@/data/categories`. The
  `Category` keeps field names `title` + `icon` (where **`icon` now holds the hero
  key**), so `CategoryCard`, feed rows, unlock modal, stats render unchanged.
- `feed.ts`: the hardcoded `CATEGORY_TO_SLUG` (2 entries) + `HERO_MASCOT` are gone
  — it derives slugs/heroes/colors via `slugForLabel` / `categoryBySlug`.
- `content.ts`: imports `RAW_LESSONS` from the generated file; the **pilot
  allowlist is retired** — every bundled lesson is exposed (`isPilotLesson` now
  just means "is bundled").
- `CategoryCard` renders the hero as a filled (`cover`) rounded tile.

Verified: 740 lessons parse, **0 unresolved image keys, 0 unmapped categories, 0
lessons without images**; tsc + lint + 28 tests green.

### Loose ends / revisit

- **Per-lesson `icon:` (386 Font-Awesome names) is still unused** — parsed into
  the model but nothing renders it. The category visual is the hero. Wire a real
  icon set later if you want per-lesson glyphs.
- **Lesson rows + unlock modal + progress tiles** still render the category hero
  small (`contain`); only `CategoryCard` was switched to `cover`. Could unify, or
  use each lesson's own hero on rows for variety.
- **Old persisted selections**: a user who'd picked a now-removed catalog slug
  (cooking/science/diy/health/history/safety) falls back to the full feed until
  they re-pick; money/mindfulness slugs were preserved.
- **APK size**: 740 lessons reference far more images now — the
  `optimize-lesson-images.js --write` pass before a production build matters more
  than ever (still deferred per the asset-ingest notes).
- ⚠️ `scripts/build-content.js` reads an **absolute Primer path** on your machine;
  it's a local authoring tool, not part of the app build.

---

## Lesson visual quality redo - Plumbing complete

Regenerated and inspected the Plumbing Basics lesson visuals with built-in
imagegen, then replaced the existing PNG assets in place so markdown image keys
and `src/constants/images.ts` stay stable.

### Completed keys

- `plumbingSystemHero`
- `supplyDrainFlow`
- `shutOffValveHero`
- `mainValveLocalValve`
- `cloggedDrainHero`
- `pTrapCleanout`
- `toiletProblemHero`
- `flapperFloatChain`
- `callPlumberHero`
- `minorMajorBoundary`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch starts with Tools:
  `toolkitHero`, `starterSet`, `measuringHero`, `measureTwice`,
  `fastenersHero`, `driverMatch`, `drillHero`, `safeDrillWall`,
  `toolSafetyHero`, `sharpBladeControl`.
- Keep the quality rule strict: do not compensate for time by accepting weak,
  muddy, text-heavy, or off-style images.

---

## Lesson visual quality redo - Tools complete

Regenerated and inspected the Tools 101 lesson visuals with built-in imagegen,
then replaced the existing PNG assets in place so markdown image keys and
`src/constants/images.ts` stay stable.

### Completed keys

- `toolkitHero`
- `starterSet`
- `measuringHero`
- `measureTwice`
- `fastenersHero`
- `driverMatch`
- `drillHero`
- `safeDrillWall`
- `toolSafetyHero`
- `sharpBladeControl`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch starts with Electrical Safety:
  `electricityFlowHero`, `voltageCurrentLoop`, `breakerHero`, `tripProtects`,
  `outletSafetyHero`, `cordHazards`, `electricalSafetyHero`,
  `warningSignsElectrical`, `electricianBoundaryHero`,
  `qualifiedElectricianBoundary`.
- Keep rejecting weak outputs. Especially watch for unwanted text/numbers on
  electrical panels, outlet markings, detector screens, and warning graphics.

---

## Lesson visual quality redo - Electrical Safety complete

Regenerated and inspected the Electrical Safety lesson visuals with built-in
imagegen, then replaced the existing PNG assets in place so markdown image keys
and `src/constants/images.ts` stay stable. This completes the current Home & Car
coverage in the visual quality redo.

### Completed keys

- `electricityFlowHero`
- `voltageCurrentLoop`
- `breakerHero`
- `tripProtects`
- `outletSafetyHero`
- `cordHazards`
- `electricalSafetyHero`
- `warningSignsElectrical`
- `electricianBoundaryHero`
- `qualifiedElectricianBoundary`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch starts with Travel Basics:
  `travelBookingHero`, `accommodationChoice`, `travelMoneyDocsHero`,
  `documentCopies`, `packingSmartHero`, `carryOnEssentials`,
  `tripPlanningHero`, `documentsEarly`, `travelSafetyHero`,
  `travelSafetyNet`.
- Keep rejecting weak outputs. Especially watch for unwanted text, passport
  stamps/letters, ticket numbers, map labels, currency numbers, and fake UI.

---

## Lesson visual quality redo - Travel Basics complete

Regenerated and inspected the Travel Basics lesson visuals with built-in
imagegen, then replaced the existing PNG assets in place so markdown image keys
and `src/constants/images.ts` stay stable.

### Completed keys

- `travelBookingHero`
- `accommodationChoice`
- `travelMoneyDocsHero`
- `documentCopies`
- `packingSmartHero`
- `carryOnEssentials`
- `tripPlanningHero`
- `documentsEarly`
- `travelSafetyHero`
- `travelSafetyNet`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch starts with Meal Planning:
  `batchCookingHero`, `portionFreeze`, `groceryShoppingHero`,
  `listStopsImpulse`, `weeklyMealPlanHero`, `inventoryMealList`,
  `reduceFoodWasteHero`, `useItUpMeal`, `mealPlanningHero`,
  `decisionFatiguePlan`.
- Keep the quality rule strict. This batch needed rejects for tiny accidental
  markings and digits, so continue inspecting closely before replacing assets.

---

## Lesson visual quality redo - Meal Planning complete

Regenerated and inspected the Meal Planning lesson visuals with built-in
imagegen, then replaced the existing PNG assets in place so markdown image keys
and `src/constants/images.ts` stay stable. Cooking & Food is now complete for
the current quality-redo manifest coverage.

### Completed keys

- `batchCookingHero`
- `portionFreeze`
- `groceryShoppingHero`
- `listStopsImpulse`
- `weeklyMealPlanHero`
- `inventoryMealList`
- `reduceFoodWasteHero`
- `useItUpMeal`
- `mealPlanningHero`
- `decisionFatiguePlan`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch starts with Insurance Claims + Renting an Apartment:
  `claimDisputeHero`, `appealEvidence`, `filingClaimHero`, `promptEvidence`,
  `fairOutcomeHero`, `preparedRecords`, `insuranceClaimHero`,
  `claimProcessFlow`, `whenToClaimHero`, `largeLossClaim`,
  `depositRightsHero`, `moveInInventory`, `rentalLivingHero`,
  `repairRecords`, `movingOutHero`, `cleanExitPhotos`, `leaseHero`,
  `leaseTerms`, `rentingProcessHero`, `upfrontRentalCost`.
- Watch closely for fake document text, policy numbers, lease terms, apartment
  signs, receipt totals, phone UI, and checklist marks.

---

## Lesson visual quality redo - Insurance Claims and Renting complete

Regenerated and inspected the Insurance Claims + Renting an Apartment lesson
visuals with built-in imagegen, then replaced the existing PNG assets in place
so markdown image keys and `src/constants/images.ts` stay stable. Practical
Life Admin is now complete for the current quality-redo manifest coverage.

### Completed keys

- `claimDisputeHero`
- `appealEvidence`
- `filingClaimHero`
- `promptEvidence`
- `fairOutcomeHero`
- `preparedRecords`
- `insuranceClaimHero`
- `claimProcessFlow`
- `whenToClaimHero`
- `largeLossClaim`
- `depositRightsHero`
- `moveInInventory`
- `rentalLivingHero`
- `repairRecords`
- `movingOutHero`
- `cleanExitPhotos`
- `leaseHero`
- `leaseTerms`
- `rentingProcessHero`
- `upfrontRentalCost`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch starts with Internet + Passwords:
  `dataPacketsHero`, `packetReassembly`, `cloudServersHero`,
  `dataCenterComputers`, `websiteBrowserUrlHero`, `urlPartsHero`,
  `internetNetworkHero`, `networkOfNetworks`, `wifiRouterHero`,
  `wifiVsMobileData`, `strongPasswordHero`, `longPasswordStrength`,
  `passwordManagerHero`, `encryptedVault`, `accountProtectionHero`,
  `accountTakeoverWarning`, `twoFactorHero`, `knowHaveFactors`,
  `passwordKeyHero`, `passwordDominoRisk`.
- Keep rejecting accidental symbols, fake document marks, phone/search UI,
  policy/lease text, numbers, checkmarks, X marks, and receipt totals.

---

## Lesson visual quality redo - Internet and Passwords complete

Regenerated and inspected the Internet + Passwords lesson visuals with built-in
imagegen, then replaced the existing PNG assets in place so markdown image keys
and `src/constants/images.ts` stay stable. Rejected and replaced weak outputs
that introduced browser/status dots or chat-style ellipsis marks.

### Completed keys

- `dataPacketsHero`
- `packetReassembly`
- `cloudServersHero`
- `dataCenterComputers`
- `websiteBrowserUrlHero`
- `urlPartsHero`
- `internetNetworkHero`
- `networkOfNetworks`
- `wifiRouterHero`
- `wifiVsMobileData`
- `strongPasswordHero`
- `longPasswordStrength`
- `passwordManagerHero`
- `encryptedVault`
- `accountProtectionHero`
- `accountTakeoverWarning`
- `twoFactorHero`
- `knowHaveFactors`
- `passwordKeyHero`
- `passwordDominoRisk`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch starts with Nutrition Labels + Smartphone Skills:
  `caloriesServingsHero`, `servingSizeTrap`, `ingredientsMarketingHero`,
  `ingredientOrder`, `macronutrientsHero`, `macroBreakdown`,
  `sugarSaltFatHero`, `hiddenSugarSalt`, `nutritionLabelHero`,
  `servingCompare`, `appsStorageHero`, `clearPhoneStorage`,
  `batteryPerformanceHero`, `batterySaver`, `smartphoneBasicsHero`,
  `phoneBuildingBlocks`, `phoneSecurityHero`, `screenLockHero`,
  `usefulPhoneFeaturesHero`, `accessibilitySettings`.
- Keep the quality rule strict. For the next batch, reject fake nutrition text,
  numbers, calorie values, barcode marks, phone UI, app icons, notification
  dots, password/code digits, and any output that feels off-brand in the lesson
  card.

---

## Lesson visual quality redo - Nutrition Labels and Smartphone Skills complete

Regenerated and inspected the Nutrition Labels + Smartphone Skills lesson
visuals with built-in imagegen, then replaced the existing PNG assets in place
so markdown image keys and `src/constants/images.ts` stay stable. Rejected
drafts that introduced fake label lines, phone dashboard UI, and a visible
typography glyph in the accessibility visual.

### Completed keys

- `caloriesServingsHero`
- `servingSizeTrap`
- `ingredientsMarketingHero`
- `ingredientOrder`
- `macronutrientsHero`
- `macroBreakdown`
- `sugarSaltFatHero`
- `hiddenSugarSalt`
- `nutritionLabelHero`
- `servingCompare`
- `appsStorageHero`
- `clearPhoneStorage`
- `batteryPerformanceHero`
- `batterySaver`
- `smartphoneBasicsHero`
- `phoneBuildingBlocks`
- `phoneSecurityHero`
- `screenLockHero`
- `usefulPhoneFeaturesHero`
- `accessibilitySettings`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch starts with the Law & Your Rights part of
  `shot-list-law-logic.md`:
  `lawLegalSystemHero`, `lawLegalSystemCivilVsCriminalHero`,
  `lawRightsWhenDetainedHero`, `lawRightsWhenDetainedCommonProtectionsHero`,
  `lawEmploymentRightsHero`, `lawEmploymentRightsCommonWorkerProtectionsHero`,
  `lawTenantLandlordRightsHero`, `lawTenantLandlordRightsTenantRightsHero`,
  `lawIntellectualPropertyHero`, `lawIntellectualPropertyTheMainTypesHero`,
  `lawSmallClaimsHero`, `lawSmallClaimsTryToResolveItFirstHero`,
  `lawWillsInheritanceHero`, `lawWillsInheritanceWhatAWillDoesHero`,
  `lawPrivacyDataRightsHero`, `lawPrivacyDataRightsRightsYouMayHaveHero`,
  `lawSigningDocumentsHero`, `lawSigningDocumentsReadAndUnderstandFirstHero`,
  `lawWhenYouNeedALawyerHero`, and
  `lawWhenYouNeedALawyerWhenYouLikelyNeedALawyerHero`.
- After that 20-image batch, continue automatically into Logic & Critical
  Thinking from the same manifest section.
- Watch closely for fake document text, readable legal marks, numbers, labels,
  court signage, checkmarks, and badge symbols.

---

## Lesson visual quality redo - Law and Your Rights complete

Regenerated and inspected the Law & Your Rights lesson visuals with built-in
imagegen, then replaced the existing PNG assets in place so markdown image keys
and `src/constants/images.ts` stay stable. Rejected one legal-document draft
that looked like fine-print pseudo-writing and replaced it with a blank-block
document visual.

### Completed keys

- `lawLegalSystemHero`
- `lawLegalSystemCivilVsCriminalHero`
- `lawRightsWhenDetainedHero`
- `lawRightsWhenDetainedCommonProtectionsHero`
- `lawEmploymentRightsHero`
- `lawEmploymentRightsCommonWorkerProtectionsHero`
- `lawTenantLandlordRightsHero`
- `lawTenantLandlordRightsTenantRightsHero`
- `lawIntellectualPropertyHero`
- `lawIntellectualPropertyTheMainTypesHero`
- `lawSmallClaimsHero`
- `lawSmallClaimsTryToResolveItFirstHero`
- `lawWillsInheritanceHero`
- `lawWillsInheritanceWhatAWillDoesHero`
- `lawPrivacyDataRightsHero`
- `lawPrivacyDataRightsRightsYouMayHaveHero`
- `lawSigningDocumentsHero`
- `lawSigningDocumentsReadAndUnderstandFirstHero`
- `lawWhenYouNeedALawyerHero`
- `lawWhenYouNeedALawyerWhenYouLikelyNeedALawyerHero`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch is Logic & Critical Thinking:
  `logicFallaciesHero`, `logicFallaciesSomeCommonFallaciesHero`,
  `logicBuildingArgumentHero`, `logicBuildingArgumentTheStructureOfAnArgumentHero`,
  `logicEvaluatingEvidenceHero`,
  `logicEvaluatingEvidenceNotAllEvidenceIsEqualHero`,
  `logicScientificMethodHero`,
  `logicScientificMethodTestIdeasAgainstRealityHero`, `logicMentalModelsHero`,
  `logicMentalModelsAFewPowerfulModelsHero`, `logicProblemSolvingHero`,
  `logicProblemSolvingAGeneralFrameworkHero`,
  `logicSpottingManipulationHero`,
  `logicSpottingManipulationManipulationVsHonestPersuasionHero`,
  `logicHealthySkepticismHero`, `logicHealthySkepticismTheBalanceToStrikeHero`,
  `logicCorrelationCausationHero`,
  `logicCorrelationCausationWhyLinkedIsnTCausedHero`,
  `logicDecisionTrapsHero`, and `logicDecisionTrapsCommonTrapsHero`.
- Watch for fake text, letters, numbers, chart labels, checklist marks,
  pseudo-writing, and overly abstract visuals that do not read instantly.

---

## Lesson visual quality redo - Logic and Critical Thinking complete

Regenerated and inspected the Logic & Critical Thinking lesson visuals with
built-in imagegen, then replaced the existing PNG assets in place so markdown
image keys and `src/constants/images.ts` stay stable. Rejected drafts that
introduced punctuation symbols, X/check marks, badges, or `VS` text, then
replaced them with cleaner blank-shape versions.

### Completed keys

- `logicFallaciesHero`
- `logicFallaciesSomeCommonFallaciesHero`
- `logicBuildingArgumentHero`
- `logicBuildingArgumentTheStructureOfAnArgumentHero`
- `logicEvaluatingEvidenceHero`
- `logicEvaluatingEvidenceNotAllEvidenceIsEqualHero`
- `logicScientificMethodHero`
- `logicScientificMethodTestIdeasAgainstRealityHero`
- `logicMentalModelsHero`
- `logicMentalModelsAFewPowerfulModelsHero`
- `logicProblemSolvingHero`
- `logicProblemSolvingAGeneralFrameworkHero`
- `logicSpottingManipulationHero`
- `logicSpottingManipulationManipulationVsHonestPersuasionHero`
- `logicHealthySkepticismHero`
- `logicHealthySkepticismTheBalanceToStrikeHero`
- `logicCorrelationCausationHero`
- `logicCorrelationCausationWhyLinkedIsnTCausedHero`
- `logicDecisionTrapsHero`
- `logicDecisionTrapsCommonTrapsHero`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch is Active Listening + Conflict Resolution:
  `activeListeningHero`, `understandNotReplyHero`, `listeningBarriersHero`,
  `internalListeningBarriersHero`, `listeningTechniquesHero`,
  `deepenUnderstandingHero`, `conversationListeningHero`,
  `genuineCuriosityHero`, `listeningMistakesHero`, `conversationKillersHero`,
  `conflictBasicsHero`, `healthyConflictHero`, `stayingCalmConflictHero`,
  `floodedPauseHero`, `resolvingDisagreementsHero`, `problemNotPersonHero`,
  `difficultConversationHero`, `directKindHero`, `conflictMistakesHero`, and
  `damagingReactionsHero`.
- Watch for fake text, speech-bubble writing, chat UI, checklist marks,
  letters/numbers, angry caricatures, and scenes that are too dramatic for the
  practical lesson-card tone.

---

## Lesson visual quality redo - Active Listening and Conflict Resolution complete

Regenerated and inspected the Active Listening + Conflict Resolution lesson
visuals with built-in imagegen, then replaced the existing PNG assets in place
so markdown image keys and `src/constants/images.ts` stay stable. Rejected and
replaced drafts that introduced X/thumb marks, question marks, exclamation
marks, warning symbols, or overly crowded conflict scenes.

### Completed keys

- `activeListeningHero`
- `understandNotReplyHero`
- `listeningBarriersHero`
- `internalListeningBarriersHero`
- `listeningTechniquesHero`
- `deepenUnderstandingHero`
- `conversationListeningHero`
- `genuineCuriosityHero`
- `listeningMistakesHero`
- `conversationKillersHero`
- `conflictBasicsHero`
- `healthyConflictHero`
- `stayingCalmConflictHero`
- `floodedPauseHero`
- `resolvingDisagreementsHero`
- `problemNotPersonHero`
- `difficultConversationHero`
- `directKindHero`
- `conflictMistakesHero`
- `damagingReactionsHero`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch is Marketing & Branding:
  `marketingWhatItIsHero`, `marketingWhatItIsMoreThanAdvertisingHero`,
  `marketingUnderstandingAudienceHero`,
  `marketingUnderstandingAudienceSpeakToSomeoneSpecificHero`,
  `marketingBrandingHero`, `marketingBrandingABrandIsAPerceptionHero`,
  `marketingContentMarketingHero`,
  `marketingContentMarketingAttractByProvidingValueHero`,
  `marketingSocialMediaHero`, `marketingSocialMediaEngagementOverBroadcastingHero`,
  `marketingSeoHero`, `marketingSeoHowSearchEnginesWorkHero`,
  `marketingEmailHero`, `marketingEmailYouOwnTheConnectionHero`,
  `marketingAdvertisingHero`, `marketingAdvertisingPayingForAttentionHero`,
  `marketingStorytellingHero`, and `marketingStorytellingWhyStoriesWorkHero`.
- Watch for fake text, letters, numbers, chart labels, app UI, checklist marks,
  brand logos, and vague business visuals that do not read instantly.

---

## Lesson visual quality redo - Marketing and Branding complete

Regenerated and inspected the Marketing & Branding lesson visuals with built-in
imagegen, then replaced the existing PNG assets in place so markdown image keys
and `src/constants/images.ts` stay stable. Rejected and replaced drafts that
introduced check/badge shapes, device UI tiles, fake search-result text rows,
and an unwanted robot/crawler character.

### Completed keys

- `marketingWhatItIsHero`
- `marketingWhatItIsMoreThanAdvertisingHero`
- `marketingUnderstandingAudienceHero`
- `marketingUnderstandingAudienceSpeakToSomeoneSpecificHero`
- `marketingBrandingHero`
- `marketingBrandingABrandIsAPerceptionHero`
- `marketingContentMarketingHero`
- `marketingContentMarketingAttractByProvidingValueHero`
- `marketingSocialMediaHero`
- `marketingSocialMediaEngagementOverBroadcastingHero`
- `marketingSeoHero`
- `marketingSeoHowSearchEnginesWorkHero`
- `marketingEmailHero`
- `marketingEmailYouOwnTheConnectionHero`
- `marketingAdvertisingHero`
- `marketingAdvertisingPayingForAttentionHero`
- `marketingStorytellingHero`
- `marketingStorytellingWhyStoriesWorkHero`
- `marketingMeasuringHero`
- `marketingMeasuringMeasureAgainstGoalsHero`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch is Math Concepts:
  `mathAlgebraHero`, `mathAlgebraFindingTheUnknownHero`, `mathGeometryHero`,
  `mathGeometryTheBuildingBlocksHero`, `mathTrigonometryHero`,
  `mathTrigonometryRelatingAnglesAndSidesHero`, `mathCalculusHero`,
  `mathCalculusTheFirstBigIdeaRatesOfChangeHero`, `mathFamousNumbersHero`,
  `mathFamousNumbersPiTheCircleNumberHero`, `mathPrimeNumbersHero`,
  `mathPrimeNumbersTheBuildingBlocksOfNumbersHero`, `mathInfinityHero`,
  `mathInfinityInfinityIsnTJustABigNumberHero`, `mathInNatureHero`,
  `mathInNaturePatternsEverywhereHero`, `mathProbabilityVsStatisticsHero`,
  `mathProbabilityVsStatisticsProbabilityPredictingForwardHero`,
  `mathHistoryHero`, and `mathHistoryFromCountingToCivilizationsHero`.
- Watch for fake text, letters, numbers, equation glyphs, formulas, chart
  labels, calculator UI, and math visuals that become classroom worksheet clutter.

---

## Lesson visual quality redo - Math Concepts complete

Regenerated and inspected the Math Concepts lesson visuals with built-in
imagegen, then replaced the existing PNG assets in place so markdown image keys
and `src/constants/images.ts` stay stable. Rejected and replaced drafts that
introduced cluttered geometry posters, dashboard-like graphs, dice-pip
probability clusters, calculator UI, and overcrowded math-history scenes.

### Completed keys

- `mathAlgebraHero`
- `mathAlgebraFindingTheUnknownHero`
- `mathGeometryHero`
- `mathGeometryTheBuildingBlocksHero`
- `mathTrigonometryHero`
- `mathTrigonometryRelatingAnglesAndSidesHero`
- `mathCalculusHero`
- `mathCalculusTheFirstBigIdeaRatesOfChangeHero`
- `mathFamousNumbersHero`
- `mathFamousNumbersPiTheCircleNumberHero`
- `mathPrimeNumbersHero`
- `mathPrimeNumbersTheBuildingBlocksOfNumbersHero`
- `mathInfinityHero`
- `mathInfinityInfinityIsnTJustABigNumberHero`
- `mathInNatureHero`
- `mathInNaturePatternsEverywhereHero`
- `mathProbabilityVsStatisticsHero`
- `mathProbabilityVsStatisticsProbabilityPredictingForwardHero`
- `mathHistoryHero`
- `mathHistoryFromCountingToCivilizationsHero`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch is Medicine & Public Health in
  `shot-list-medicine-money.md`.
- Watch for fake text, letters, numbers, medical labels, warning-sign overload,
  realistic injuries, and scary clinical scenes.

---

## Lesson visual quality redo - Medicine and Public Health complete

Regenerated and inspected the Medicine & Public Health lesson visuals with
built-in imagegen, then replaced the existing PNG assets in place so markdown
image keys and `src/constants/images.ts` stay stable. Rejected and replaced
drafts that introduced check/badge symbols, a skull, chart/checkmark clutter,
or overly literal clinical/scary cues.

### Completed keys

- `medicineVaccinesHero`
- `medicineVaccinesHowAVaccineWorksHero`
- `medicineAntibioticsResistanceHero`
- `medicineAntibioticsResistanceWhatAntibioticsDoAndDonTHero`
- `medicinePandemicsHero`
- `medicinePandemicsHowDiseasesSpreadHero`
- `medicineChronicDiseasesHero`
- `medicineChronicDiseasesWhatMakesThemDifferentHero`
- `medicineHeartDiseaseHero`
- `medicineHeartDiseaseHowItDevelopsHero`
- `medicineCancerHero`
- `medicineCancerWhenCellsBreakTheRulesHero`
- `medicineMentalHealthConditionsHero`
- `medicineMentalHealthConditionsRealCommonConditionsHero`
- `medicineHospitalsTriageHero`
- `medicineHospitalsTriageWhyUrgencyNotOrderHero`
- `medicineMedicalTestsHero`
- `medicineMedicalTestsWhatTestsDoHero`
- `medicineHistoryHero`
- `medicineHistoryFromSuperstitionToScienceHero`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch is the first finance chunk in
  `shot-list-medicine-money.md`: credit scores, blockchain, insurance basics,
  risk/return, income vs. expenses, budgeting, taxes, APR, wallets/keys, and
  insurance types.
- Watch for fake text, letters, numbers, chart labels, app UI, logos, currency
  symbols, and finance scenes that look like dashboards instead of lesson art.

---

## Lesson visual quality redo - Finance chunk 1 complete

Regenerated and inspected the first deeper-finance batch from
`shot-list-medicine-money.md` with built-in imagegen, then replaced the existing
PNG assets in place so markdown image keys and `src/constants/images.ts` stay
stable. Rejected and replaced drafts that introduced road-like letters, medical
symbols, dashboard-style credit visuals, and overly chart-like APR scenes.

### Completed keys

- `financeCreditCreditScoresHero`
- `financeCreditCreditScoresWhatMovesItUpHero`
- `financeCryptoHowBlockchainWorksHero`
- `financeCryptoHowBlockchainWorksHowItStaysHonestHero`
- `financeInsuranceHowItWorksHero`
- `financeInsuranceHowItWorksPremiumAndDeductibleHero`
- `financeInvestingRiskAndReturnHero`
- `financeInvestingRiskAndReturnTheRiskReturnTradeOffHero`
- `financePersonalIncomeVsExpensesHero`
- `financePersonalIncomeVsExpensesTheGapIsEverythingHero`
- `financeSavingBudgetingMethodsHero`
- `financeSavingBudgetingMethodsThe503020RuleHero`
- `financeTaxesTypesOfTaxesHero`
- `financeTaxesTypesOfTaxesTaxesOnEarningAndBuyingHero`
- `financeCreditInterestAndAprHero`
- `financeCreditInterestAndAprAprVsInterestRateHero`
- `financeCryptoWalletsAndKeysHero`
- `financeCryptoWalletsAndKeysPublicVsPrivateKeysHero`
- `financeInsuranceTypesYouMightNeedHero`
- `financeInsuranceTypesYouMightNeedProtectingYourBodyAndIncomeHero`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch is finance chunk 2 in `shot-list-medicine-money.md`:
  `financeInvestingStocksBondsFundsHero`,
  `financeInvestingStocksBondsFundsStocksAndBondsHero`,
  `financePersonalNeedsVsWantsHero`,
  `financePersonalNeedsVsWantsTheBlurryMiddleHero`,
  `financeSavingSaveConsistentlyHero`,
  `financeSavingSaveConsistentlyPayYourselfFirstHero`,
  `financeTaxesHowIncomeTaxWorksHero`,
  `financeTaxesHowIncomeTaxWorksHowBracketsReallyWorkHero`,
  `financeCreditTypesOfLoansHero`,
  `financeCreditTypesOfLoansSecuredVsUnsecuredHero`,
  `financeCryptoRisksAndVolatilityHero`,
  `financeCryptoRisksAndVolatilityWhyPricesSwingSoHardHero`,
  `financeInsuranceReadingAPolicyHero`,
  `financeInsuranceReadingAPolicyHuntForTheExclusionsHero`,
  `financeInvestingCompoundingHero`,
  `financeInvestingCompoundingHowTheSnowballWorksHero`,
  `financePersonalEmergencyFundHero`,
  `financePersonalEmergencyFundHowMuchToAimForHero`,
  `financeSavingCuttingExpensesHero`, and
  `financeSavingCuttingExpensesTargetTheBigWinsFirstHero`.
- Keep rejecting fake text, letters, numbers, chart labels, app UI, logos,
  currency symbols, policy fine print, and finance visuals that collapse into
  dashboards instead of lesson art.

---

## Lesson visual quality redo - Finance chunk 2 complete

Regenerated and inspected the second deeper-finance batch from
`shot-list-medicine-money.md` with built-in imagegen, then replaced the existing
PNG assets in place so markdown image keys and `src/constants/images.ts` stay
stable. Rejected and replaced drafts that introduced currency marks, medical
plus symbols, warning icons, money marks on paperwork, icon clutter, and app-like
expense category visuals.

### Completed keys

- `financeInvestingStocksBondsFundsHero`
- `financeInvestingStocksBondsFundsStocksAndBondsHero`
- `financePersonalNeedsVsWantsHero`
- `financePersonalNeedsVsWantsTheBlurryMiddleHero`
- `financeSavingSaveConsistentlyHero`
- `financeSavingSaveConsistentlyPayYourselfFirstHero`
- `financeTaxesHowIncomeTaxWorksHero`
- `financeTaxesHowIncomeTaxWorksHowBracketsReallyWorkHero`
- `financeCreditTypesOfLoansHero`
- `financeCreditTypesOfLoansSecuredVsUnsecuredHero`
- `financeCryptoRisksAndVolatilityHero`
- `financeCryptoRisksAndVolatilityWhyPricesSwingSoHardHero`
- `financeInsuranceReadingAPolicyHero`
- `financeInsuranceReadingAPolicyHuntForTheExclusionsHero`
- `financeInvestingCompoundingHero`
- `financeInvestingCompoundingHowTheSnowballWorksHero`
- `financePersonalEmergencyFundHero`
- `financePersonalEmergencyFundHowMuchToAimForHero`
- `financeSavingCuttingExpensesHero`
- `financeSavingCuttingExpensesTargetTheBigWinsFirstHero`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch is finance chunk 3 in `shot-list-medicine-money.md`:
  `financeTaxesFilingAndReturnsHero`,
  `financeTaxesFilingAndReturnsWithholdingVsFilingHero`,
  `financeCreditCardsDoneRightHero`,
  `financeCreditCardsDoneRightTheGoldenRuleHero`,
  `financeCryptoScamsAndSafetyHero`,
  `financeCryptoScamsAndSafetyTheBiggestRedFlagsHero`,
  `financeInsuranceCommonMistakesHero`,
  `financeInsuranceCommonMistakesTooLittleTooMuchHero`,
  `financeInvestingDiversificationHero`,
  `financeInvestingDiversificationHowSpreadingWorksHero`,
  `financePersonalGoodVsBadDebtHero`,
  `financePersonalGoodVsBadDebtWhatMakesDebtGoodHero`,
  `financeSavingSinkingFundsHero`,
  `financeSavingSinkingFundsHowToSetOneUpHero`,
  `financeTaxesCommonMistakesHero`,
  `financeTaxesCommonMistakesLeavingMoneyOnTheTableHero`,
  `financeCreditBorrowingTrapsHero`,
  `financeCreditBorrowingTrapsThePaydayLoanTrapHero`,
  `financeInvestingCommonMistakesHero`, and
  `financeInvestingCommonMistakesEmotionalTrapsHero`.
- Keep rejecting fake text, letters, numbers, chart labels, app UI, logos,
  currency symbols, policy fine print, warning triangles, credit-card numbers,
  and finance visuals that collapse into dashboards instead of lesson art.

---

## Lesson visual quality redo - Finance chunk 3 complete

Regenerated and inspected the third deeper-finance batch from
`shot-list-medicine-money.md` with built-in imagegen, then replaced the existing
PNG assets in place so markdown image keys and `src/constants/images.ts` stay
stable. Rejected and replaced drafts that introduced checkmarks and
dashboard-like growth bars.

### Completed keys

- `financeTaxesFilingAndReturnsHero`
- `financeTaxesFilingAndReturnsWithholdingVsFilingHero`
- `financeCreditCardsDoneRightHero`
- `financeCreditCardsDoneRightTheGoldenRuleHero`
- `financeCryptoScamsAndSafetyHero`
- `financeCryptoScamsAndSafetyTheBiggestRedFlagsHero`
- `financeInsuranceCommonMistakesHero`
- `financeInsuranceCommonMistakesTooLittleTooMuchHero`
- `financeInvestingDiversificationHero`
- `financeInvestingDiversificationHowSpreadingWorksHero`
- `financePersonalGoodVsBadDebtHero`
- `financePersonalGoodVsBadDebtWhatMakesDebtGoodHero`
- `financeSavingSinkingFundsHero`
- `financeSavingSinkingFundsHowToSetOneUpHero`
- `financeTaxesCommonMistakesHero`
- `financeTaxesCommonMistakesLeavingMoneyOnTheTableHero`
- `financeCreditBorrowingTrapsHero`
- `financeCreditBorrowingTrapsThePaydayLoanTrapHero`
- `financeInvestingCommonMistakesHero`
- `financeInvestingCommonMistakesEmotionalTrapsHero`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch is the next 20 manifest entries, crossing from the last
  deeper-finance cards into Medicines:
  `financePersonalMoneyGoalsHero`,
  `financePersonalMoneyGoalsThreeTimeHorizonsHero`,
  `financeSavingCommonMistakesHero`,
  `financeSavingCommonMistakesTheTooStrictTrapHero`,
  `financeCreditGettingOutOfDebtHero`,
  `financeCreditGettingOutOfDebtAvalancheVsSnowballHero`,
  `financePersonalCommonMistakesHero`,
  `financePersonalCommonMistakesTheSpendingTrapsHero`, `catMedicinesHero`,
  `catBrainHowItWorksHero`, `medicinesBasicsHero`, `medicineTargetPath`,
  `medicineLabelHero`, `activeIngredientCheck`, `safeMedicineHero`,
  `doseTimingHero`, `antibioticsHero`, `antibioticResistanceHero`,
  `sideEffectsHero`, and `sideEffectBalance`.
- Keep rejecting fake text, letters, numbers, chart labels, app UI, logos,
  currency symbols, medical crosses, pill-label writing, dose numbers, warning
  triangles, and scary clinical scenes.

---

## Lesson visual quality redo - Finance chunk 4 and Medicines start complete

Regenerated and inspected the fourth deeper-finance batch plus the first
Medicines visuals with built-in imagegen, then replaced the existing PNG assets
in place so markdown image keys and `src/constants/images.ts` stay stable.
Rejected and replaced drafts that introduced lock/calendar icon clutter, literal
flags, game/app icon clutter, and an information glyph.

### Completed keys

- `financePersonalMoneyGoalsHero`
- `financePersonalMoneyGoalsThreeTimeHorizonsHero`
- `financeSavingCommonMistakesHero`
- `financeSavingCommonMistakesTheTooStrictTrapHero`
- `financeCreditGettingOutOfDebtHero`
- `financeCreditGettingOutOfDebtAvalancheVsSnowballHero`
- `financePersonalCommonMistakesHero`
- `financePersonalCommonMistakesTheSpendingTrapsHero`
- `catMedicinesHero`
- `catBrainHowItWorksHero`
- `medicinesBasicsHero`
- `medicineTargetPath`
- `medicineLabelHero`
- `activeIngredientCheck`
- `safeMedicineHero`
- `doseTimingHero`
- `antibioticsHero`
- `antibioticResistanceHero`
- `sideEffectsHero`
- `sideEffectBalance`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Skip the exempt Mindfulness and original Money pilot assets; those remain the
  quality reference and should not be overwritten in the redo pass.
- Next quality batch is the next 20 non-exempt manifest entries:
  `brainHowItWorksHero`, `neuronNetworkHero`, `catMusclesBonesHero`,
  `catNervousSystemHero`, `musclesBonesHero`, `bonesLivingTissueHero`,
  `nervousSystemDeepDiveHero`, `reflexShortcutHero`, `catMusicAudioHero`,
  `catNumbersDataLiteracyHero`, `musicHowMusicWorksHero`,
  `musicHowMusicWorksTheBuildingBlocksHero`, `musicReadingMusicHero`,
  `musicReadingMusicNotesOnAPageHero`, `musicRhythmTimingHero`,
  `musicRhythmTimingBeatAndTempoHero`, `musicMelodyHarmonyHero`,
  `musicMelodyHarmonyMelodyTheTuneHero`, `musicHowInstrumentsSoundHero`, and
  `musicHowInstrumentsSoundSoundIsVibrationHero`.
- Keep rejecting fake text, letters, numbers, chart labels, app UI, logos, music
  notation glyphs that read as text, medical crosses, scary anatomy, and
  cluttered diagrams.

---

## Lesson visual quality redo - Brain, Muscles, Nervous System, and Music start complete

Regenerated and inspected the Brain, Muscles/Bones, Nervous System, Music/Audio,
and Numbers/Data category-start batch with built-in imagegen. The first pass
produced many portrait assets, so those were rejected and regenerated as wide
`1672x941` images to fit the app's wide lesson visual slot. Also rejected
icon-bubble brain drafts, organ-heavy nervous-system drafts, and music-note
glyph drift.

### Completed keys

- `brainHowItWorksHero`
- `neuronNetworkHero`
- `catMusclesBonesHero`
- `catNervousSystemHero`
- `musclesBonesHero`
- `bonesLivingTissueHero`
- `nervousSystemDeepDiveHero`
- `reflexShortcutHero`
- `catMusicAudioHero`
- `catNumbersDataLiteracyHero`
- `musicHowMusicWorksHero`
- `musicHowMusicWorksTheBuildingBlocksHero`
- `musicReadingMusicHero`
- `musicReadingMusicNotesOnAPageHero`
- `musicRhythmTimingHero`
- `musicRhythmTimingBeatAndTempoHero`
- `musicMelodyHarmonyHero`
- `musicMelodyHarmonyMelodyTheTuneHero`
- `musicHowInstrumentsSoundHero`
- `musicHowInstrumentsSoundSoundIsVibrationHero`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch is Music continuation + Numbers/Data Literacy:
  `musicGenresHero`, `musicGenresWhatDefinesAGenreHero`,
  `musicProductionHero`, `musicProductionFromSoundsToATrackHero`,
  `musicHowSoundWorksHero`, `musicHowSoundWorksSoundIsATravelingWaveHero`,
  `musicSingingHero`, `musicSingingTheVoiceAsAnInstrumentHero`,
  `musicIndustryHero`, `musicIndustryHowMoneyFlowsHero`,
  `dataChartsWhyTheyMatterHero`,
  `dataChartsWhyTheyMatterWhyWeUseChartsHero`,
  `dataMentalmathWhyItMattersHero`,
  `dataMentalmathWhyItMattersItSTricksNotTalentHero`,
  `dataPercentagesWhatTheyAreHero`,
  `dataPercentagesWhatTheyArePerHundredHero`, `dataProbabilityWhatItIsHero`,
  `dataProbabilityWhatItIsTheScaleOfLikelihoodHero`,
  `dataStatisticsWhatTheyAreHero`, and
  `dataStatisticsWhatTheyAreFromDataToInsightHero`.
- Keep using wide prompts and reject fake text, letters, numbers, chart labels,
  app UI, logos, sheet-music notation, and classroom worksheet clutter.

---

## Lesson visual quality redo - Music continuation and Numbers/Data start complete

Regenerated and inspected the Music continuation plus first Numbers/Data Literacy
batch with built-in imagegen, then replaced the existing PNG assets in place.
Accepted assets are wide `1672x941`. Rejected and replaced the music-industry
intro draft for play/music-note UI shorthand.

### Completed keys

- `musicGenresHero`
- `musicGenresWhatDefinesAGenreHero`
- `musicProductionHero`
- `musicProductionFromSoundsToATrackHero`
- `musicHowSoundWorksHero`
- `musicHowSoundWorksSoundIsATravelingWaveHero`
- `musicSingingHero`
- `musicSingingTheVoiceAsAnInstrumentHero`
- `musicIndustryHero`
- `musicIndustryHowMoneyFlowsHero`
- `dataChartsWhyTheyMatterHero`
- `dataChartsWhyTheyMatterWhyWeUseChartsHero`
- `dataMentalmathWhyItMattersHero`
- `dataMentalmathWhyItMattersItSTricksNotTalentHero`
- `dataPercentagesWhatTheyAreHero`
- `dataPercentagesWhatTheyArePerHundredHero`
- `dataProbabilityWhatItIsHero`
- `dataProbabilityWhatItIsTheScaleOfLikelihoodHero`
- `dataStatisticsWhatTheyAreHero`
- `dataStatisticsWhatTheyAreFromDataToInsightHero`

### Continuation

- Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Next quality batch is Numbers/Data Literacy continuation:
  `dataChartsCommonTypesHero`,
  `dataChartsCommonTypesBarsLinesAndPiesHero`,
  `dataMentalmathAdditionSubtractionHero`,
  `dataMentalmathAdditionSubtractionAddLeftToRightInChunksHero`,
  `dataPercentagesCalculatingHero`,
  `dataPercentagesCalculatingTheEasyBuildingBlocksHero`,
  `dataProbabilityCalculatingSimpleHero`,
  `dataProbabilityCalculatingSimpleTheBasicFormulaHero`,
  `dataStatisticsAveragesHero`, `dataStatisticsAveragesTheThreeAveragesHero`,
  `dataChartsReadingAccuratelyHero`,
  `dataChartsReadingAccuratelyCheckTheAxesAndScaleHero`,
  `dataMentalmathMultiplicationHero`,
  `dataMentalmathMultiplicationEasyBuildingBlocksHero`,
  `dataPercentagesIncreaseDecreaseHero`,
  `dataPercentagesIncreaseDecreaseHowChangesWorkHero`,
  `dataProbabilityIndependentEventsHero`,
  `dataProbabilityIndependentEventsIndependentEventsHaveNoMemoryHero`,
  `dataStatisticsHowTheyMisleadHero`, and
  `dataStatisticsHowTheyMisleadCommonMisleadingTricksHero`.
- Keep using wide prompts and reject fake text, letters, numbers, equation
  glyphs, chart labels, axis numbers, app UI, logos, and classroom worksheet
  clutter.

---

## Lesson visual quality redo - context needed before next generation pass

Inventory checked on 2026-06-26:

- `assets/images/lessons/` contains 1,481 PNG lesson visuals.
- `image-pipeline/lesson-visual-manifest.md` reports full coverage:
  1,584 total entries, 1,584 done, 0 pending, with 103 category heroes and
  1,481 lesson visuals.
- Coverage is complete, but quality redo is still in progress. Continue from
  `image-pipeline/quality-regeneration-progress.md`.
- Current continuation point is the next 20 Numbers/Data Literacy assets listed
  under `## Next Action`.

Context needed from the user before generating replacements:

- Confirm whether to replace assets in place using the same filenames and image
  keys.
- Confirm whether the accepted wide `1672x941` imagegen style is still the
  target, despite the older style guide mentioning `1024x768`.
- Provide 3-5 example filenames that are definitely "good" and 3-5 that are
  definitely "bad" if the quality bar has shifted.
- Confirm whether to proceed batch-by-batch from the documented next 20 entries
  or prioritize a specific category first.

---

## Lesson visual quality redo - health/science bridge batch complete

Completed on 2026-06-27:

- Replaced the 20-image Health & Body + Everyday Science bridge batch from
  `exerciseMistakesHero` through `weatherVsClimate`.
- Restored copied assets from the generated-image cache when the initial bridge
  copies were missing from `assets/images/lessons/`, then normalized all final
  files to `1672x941`.
- QA contact sheet passed with no obvious fake text, labels, digits, watermarks,
  or UI screenshots.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: `weatherIngredientsHero`, `airPressureWaterCycle`, the respiratory and
  hormones body assets, then the scams/privacy technology assets through
  `freezeChangeReport`.

Validation status:

- `npm run lint` completed successfully.
- `npx tsc --noEmit` completed successfully.
- `image-pipeline/update-lesson-visual-manifest.js` now reports current
  workspace coverage as `159/1584` done, with `1425` pending. Continue from the
  tracker's next batch rather than relying on older full-placeholder coverage
  notes.

---

## Lesson visual quality redo - weather/body/scams batch complete

Completed on 2026-06-27:

- Replaced the 20-image bridge batch from `weatherIngredientsHero` through
  `freezeChangeReport`, including category heroes for respiratory, hormones,
  scams, and privacy.
- Normalized all final files to `1672x941`; seven generated outputs needed a
  small width correction.
- QA contact sheet passed with no actual text, labels, letters, digits,
  readable UI, logos, or watermarks. Some accepted cybersecurity images use
  simple warning/check symbols but no fake words or numbers.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: privacy lessons from `cookiesTrackingHero` through
  `privacyControlGate`, then five-senses/immune body assets, then
  `catSleepHero`, `catMentalHealthHero`, `sleepWhyHero`, and
  `sleepBodyRepairHero`.
- Registered all 40 new image keys from the two completed batches in
  `src/constants/images.ts`; manifest coverage advanced to `159/1584`.
- `npm run lint` and `npx tsc --noEmit` completed successfully after the
  registration update.

---

## Lesson visual quality redo - privacy/body/sleep batch complete

Completed on 2026-06-28:

- Replaced the 20-image batch from `cookiesTrackingHero` through
  `sleepBodyRepairHero`, including privacy lessons, five-senses/immune assets,
  and sleep/mental-health category starts.
- Normalized all final files to `1672x941`; fifteen generated outputs needed a
  small width correction.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, or watermarks.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `179/1584`, with `1405` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: sleep cycles/habits/disruptors/fixes, mental health lessons through
  `helpSourcesHero`, then `catSpaceHero` and `catBodyHero`.

---

## Lesson visual quality redo - sleep/mental/space-body batch complete

Completed on 2026-06-28:

- Replaced the 20-image batch from `sleepCyclesHero` through `catBodyHero`,
  covering remaining sleep lessons, mental-health lessons, and category heroes
  for Space & Astronomy and How Your Body Works.
- Normalized all final files to `1672x941`; thirteen generated outputs needed a
  small width correction.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, or watermarks.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `199/1584`, with `1385` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Space Deep Dive lessons from `spaceExplorationHero` through
  `starFusionHero`, then Human Body systems lessons from `brainNervesHero`
  through `cellsToSystemsHero`.

---

## Lesson visual quality redo - space/body systems lesson batch complete

Completed on 2026-06-29:

- Replaced the 20-image batch from `spaceExplorationHero` through
  `cellsToSystemsHero`, covering Space & Astronomy lesson visuals and How Your
  Body Works system lessons.
- Normalized all final files to `1672x941`; seven generated outputs needed a
  small width correction.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, or watermarks.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `219/1584`, with `1365` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Space Deep Dive category and lesson visuals from `catBlackHolesHero`
  through `catTelescopesHero`.

---

## Lesson visual quality redo - space deep dive batch complete

Completed on 2026-06-29:

- Replaced the 20-image Space Deep Dive batch from `catBlackHolesHero` through
  `catTelescopesHero`, covering black holes, the Big Bang, eclipses, future
  space travel, galaxies, life-search, exploration history, and telescopes.
- Normalized all final files to `1672x941`; ten generated outputs needed a
  small width correction.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, or watermarks.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `239/1584`, with `1345` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: remaining Space Deep Dive lesson visuals through `solarActivityHero`,
  then Public Speaking / Relationships starts through `deliveryVoiceHero`.

---

## Lesson visual quality redo - space remainder and speaking start complete

Completed on 2026-06-29:

- Replaced the 20-image mixed batch from `spaceddHistoryHero` through
  `deliveryVoiceHero`, covering remaining Space Deep Dive visuals and the start
  of Public Speaking / Relationships.
- Normalized all final files to `1672x941`; two generated outputs needed a
  small width correction.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, or watermarks.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `259/1584`, with `1325` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: speaking and relationships lesson visuals from `pausePaceHero` through
  `adultFriendshipsHero`.

---

## Lesson visual quality redo - speaking and relationships batch complete

Completed on 2026-06-29:

- Replaced the 20-image Public Speaking / Relationships batch from
  `pausePaceHero` through `adultFriendshipsHero`.
- Normalized all final files to `1672x941`; one generated output needed a size
  correction.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, or watermarks.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `279/1584`, with `1305` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: final relationships visuals and Tools / Electrical Safety starts from
  `nurturingFriendshipsHero` through `breakerHero`.

---

## "Go Deeper" (Pro-only deeper lessons) — TODO, deferred

The dev-kit design specifies a **"Go Deeper"** tier: within a topic, some
subtopic lessons are Pro-only (frontmatter `pro: true` → "Go Deeper" lesson).
Pro ($4.99) unlocks them along with no-ads / all-categories / etc.; free users
get the basic lessons.

**Current state (not built):**
- Each topic already has multiple lessons (subtopics) — e.g. "Banking & Accounts"
  is 7 lessons, `order` 1–7. They were all showing the shared `topic` as their
  title (looked like duplicates); now fixed to show each lesson's distinct
  `subtitle` in `LessonListItem` + `ExploreCard`.
- **No `pro` tier yet:** 0 of the 58 content files have a `pro:` field, and the
  parser (`lib/content.ts`) / `Lesson` type don't read one — so every lesson is
  currently free.

**To implement later:**
1. Decide the free-vs-Pro rule (e.g. "first lesson of each topic free, rest are
   Go Deeper", or mark `pro: true` per lesson in the Primer source).
2. Parse `pro` into the `Lesson` model.
3. Gate `pro: true` lessons behind the existing `isPro` check (reuse the lock
   pattern from coin-locked categories / `LessonLocked`), with a "Go Deeper"
   badge in the lists + an upsell to the paywall.

---

## Lesson visual quality redo - food safety tail and chemistry start complete

Completed on 2026-07-02:

- Replaced the 20-image batch from `temperatureSafetyHero` through `insideAtom`,
  covering the tail of Food Safety, Chemistry category/lesson starts, and the
  Electricity Science category hero.
- Normalized all final files to `1672x941`; no generated drafts were rejected
  in the final contact sheet.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, UI screenshots, watermarks, thermometer numbers, packaging text,
  formula glyphs, element symbols, periodic-table text, battery polarity marks,
  or chemistry labels.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `590/1584`, with `994` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: electricity lesson visuals from `circuitLoopHero` through
  `conductorsInsulators`, then cleaning visuals from `catCleaningHero` through
  `declutterHero`.

---

## Lesson visual quality redo - electricity and cleaning start complete

Completed on 2026-07-02:

- Replaced the 20-image batch from `circuitLoopHero` through `declutterHero`,
  covering Electricity Science lesson visuals and the first Cleaning & Upkeep
  category/lesson visuals.
- Normalized all final files to `1672x941`; no generated drafts were rejected
  in the final contact sheet.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, UI screenshots, watermarks, polarity marks, battery symbols, magnet
  letters, bottle writing, appliance labels, calendar day names, calendar
  numbers, or cleaning-product hazard icons.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `610/1584`, with `974` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: cleaning tail `keepDonateDiscard`, Cooking visuals through
  `hotPanCrowding`, then Coding/Creative Writing starts through `dataTypesHero`.

---

## Lesson visual quality redo - cleaning tail, cooking, and coding start complete

Completed on 2026-07-02:

- Replaced the 20-image batch from `keepDonateDiscard` through `dataTypesHero`,
  covering the Cleaning & Upkeep tail, Cooking category/lesson visuals, and the
  first Coding/Creative Writing visuals.
- Normalized all final files to `1672x941`; no generated drafts were rejected
  in the final contact sheet.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, UI screenshots, watermarks, bin labels, cookbook text, recipe-step
  numbers, appliance numbers, code text, terminal UI, notebook writing,
  dialogue text, punctuation glyphs, or worksheet clutter.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `630/1584`, with `954` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: remaining Coding & Programming visuals from `loopsLogicHero` through
  `noCodeLimitsHero`, then Creative Writing starts through
  `authenticInfluenceHero`.

---

## Lesson visual quality redo - coding remainder and writing voice start complete

Completed on 2026-07-02:

- Replaced the 20-image batch from `loopsLogicHero` through
  `authenticInfluenceHero`, covering the remaining Coding & Programming visuals
  and the first Creative Writing voice visuals.
- Normalized all final files to `1672x941`.
- QA contact sheet passed after rejecting the first `databasesHero` draft for
  record-card line rows and the first `authenticInfluenceHero` draft for page
  lines and music-note glyphs. Accepted assets have no readable text, labels,
  letters, digits, logos, UI screenshots, watermarks, code text, terminal UI,
  browser chrome, database labels, branch labels, version numbers, notebook
  writing, book titles, dialogue text, or pseudo record text.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `650/1584`, with `934` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Creative Writing story/editing/publishing visuals from
  `storyStructureCreativeHero` through `publishingRoutesHero`, then Consumer
  Rights and Reading Contracts category heroes.

---

## Lesson visual quality redo - creative writing tail and consumer contracts start complete

Completed on 2026-07-02:

- Replaced the 20-image batch from `storyStructureCreativeHero` through
  `catReadingContractsHero`, covering Creative Writing story/dialogue/editing/
  publishing visuals and the Consumer Rights / Reading Contracts category
  heroes.
- Normalized all final files to `1672x941`; no generated drafts were rejected
  in the final contact sheet.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, UI screenshots, watermarks, notebook writing, dialogue text, book
  text, manuscript text, poem lines, receipt text, refund numbers, currency
  symbols, contract fine print, form fields, or signature text.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `670/1584`, with `914` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Consumer Rights lessons from `consumerRightsHero` through
  `subscriptionTrap`, then Reading Contracts lessons through `keepContractCopy`.

---

## Lesson visual quality redo - consumer rights and reading contracts lessons complete

Completed on 2026-07-03:

- Replaced the 20-image batch from `consumerRightsHero` through
  `keepContractCopy`, covering Consumer Rights lesson visuals and Reading
  Contracts lesson visuals.
- Normalized all final files to `1672x941`.
- QA contact sheet passed after rejecting the first `contractMistakesHero` draft
  for punctuation-like warning marks. Accepted assets have no readable text,
  labels, letters, digits, logos, UI screenshots, watermarks, receipt lines,
  barcodes, currency symbols, warranty-card text, seller-counter signage,
  support chat text, calendar numbers, contract fine print, form fields,
  signature text, or hidden-fee labels.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `690/1584`, with `894` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Design Visual and Earth Science category heroes, then Design lesson
  visuals from `designPrinciplesHero` through `compositionOverGearHero`.

---

## Lesson visual quality redo - design visual and earth science start complete

Completed on 2026-07-03:

- Replaced the 20-image batch from `catDesignVisualHero` through
  `compositionOverGearHero`, covering Design Visual category/lesson visuals
  and the Earth Science category hero.
- Normalized all final files to `1672x941`; no generated drafts were rejected
  in the final contact sheet.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, UI screenshots, watermarks, typography letters, sample logo marks,
  brand marks, tool labels, or camera UI. Blank type bars, blank layout cards,
  color swatches, guide lines, blank interface cards, camera framing cues, and
  generic geometric identity motifs were accepted as lesson cues.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `710/1584`, with `874` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Design eye visuals from `developingEyeHero` through
  `practiceObservationHero`, then Earth Science lessons from
  `mountainsFormHero` through `fossilCluesHero`.

---

## Lesson visual quality redo - design eye and earth science lessons complete

Completed on 2026-07-03:

- Replaced the 20-image batch from `developingEyeHero` through
  `fossilCluesHero`, covering the Design developing-your-eye lesson and Earth
  Science lessons for mountains, volcanoes, earthquakes, rock cycle, minerals,
  water cycle, atmosphere, soil erosion, and fossils.
- Normalized all final files to `1672x941`; the batch used a mapped ingest
  because the first `practiceObservationHero` generation produced no file and a
  `mineralStructureHero` retry produced a duplicate candidate.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, UI screenshots, watermarks, map labels, compass letters, mineral
  labels, rock-type abbreviations, volcano warning signs, fault labels, layer
  labels, water-cycle labels, atmosphere layer text, fossil museum tags,
  timeline numbers, or classroom diagram callouts.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `730/1584`, with `854` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Earth Science tail from `cavesHero` through
  `earthForcesWondersHero`, then Energy & Power / Everyday Economics starts
  through `energyBatteriesHowBatteriesWorkHero`.

---

## Lesson visual quality redo - earth science tail and energy start complete

Completed on 2026-07-03:

- Replaced the 20-image batch from `cavesHero` through
  `energyBatteriesHowBatteriesWorkHero`, covering the Earth Science tail,
  Energy & Power and Everyday Economics category heroes, and Energy lessons
  from fossil fuels through batteries.
- Normalized all final files to `1672x941`; one `catEverydayEconomicsHero`
  draft was rejected for currency-like token markings and replaced with a clean
  unmarked-token retry through a mapped ingest.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, UI screenshots, watermarks, cave signs, map labels, power-plant signs,
  grid labels, battery polarity marks, socket markings, solar panel numbers,
  turbine labels, warning symbols, nuclear/radiation marks, currency symbols,
  market tickers, price tags, graph axes, or dashboard-style UI.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `750/1584`, with `834` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Energy transition / EV / oil and gas visuals from
  `energyTransitionHero` through `energyOilAndGasFromGroundToProductHero`,
  then GDP and Markets lessons through
  `econMarketsCompetitionAndMonopoliesWhyCompetitionHelpsConsumersHero`.

---

## Lesson visual quality redo - energy transition, GDP, and markets complete

Completed on 2026-07-03:

- Replaced the 20-image batch from `energyTransitionHero` through
  `econMarketsCompetitionAndMonopoliesWhyCompetitionHelpsConsumersHero`,
  covering Energy transition, EVs, oil and gas, GDP, unemployment, interest
  rates, reading economic indicators, and market competition.
- Normalized all final files to `1672x941`; rejected and regenerated
  `econGdpGrowthAndRecessionsTheEconomicCycleHero` for a tiny storefront sign
  and `econGdpReadingEconomicNewsReadingIndicatorsTogetherHero` for
  dashboard-style panels.
- QA contact sheet passed with no readable text, labels, letters, digits,
  logos, UI screenshots, watermarks, power-plant signs, battery polarity marks,
  charger UI, fuel labels, GDP text, percent signs, unemployment-rate labels,
  interest-rate symbols, news headlines, newspaper text, market-stall signs,
  monopoly board-like marks, currency symbols, price tags, graph axes, or
  finance-dashboard widgets.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `770/1584`, with `814` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: market role-of-money/economic-systems/market-failure visuals, then
  Supply & Demand and Inflation starts through
  `econInflationWhatCausesItDemandPullAndCostPushHero`.

---

## Lesson visual quality redo - markets, supply-demand, and inflation start complete

Completed on 2026-07-06:

- Replaced the 20-image batch from `econMarketsRoleOfMoneyHero` through
  `econInflationWhatCausesItDemandPullAndCostPushHero`, covering market role
  of money, economic systems, market failures, supply and demand, and the first
  Inflation visuals.
- Normalized all final files to `1672x941`; used mapped ingest because several
  generated drafts were intentionally rejected before replacement.
- QA contact sheet passed after rejecting drafts with red X marks, a flag,
  dashboard/classroom-panel clutter, phone/UI motifs, and gauge/circled-arrow
  pricing motifs. Accepted assets have no readable text, labels, letters,
  digits, logos, UI screenshots, watermarks, supply/demand curve axes,
  demand/supply letters, price labels, price tags, sale stickers, percent
  marks, inflation headlines, currency symbols, shopping receipt text, fake
  product packaging text, or dashboard-style UI.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `790/1584`, with `794` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Inflation tail from `econInflationHowItAffectsYouHero` through
  `econInflationProtectingAgainstWhyCashAloneLosesOutHero`, Prices lessons
  through `econPricesSmartConsumerJudgeValueNotJustPriceHero`, then Global
  Trade starts through `econTradeImportsAndExportsImportsAndExportsHero`.

## Lesson visual quality redo - inflation tail, prices, and trade start complete

Completed on 2026-07-07:

- Replaced the 20-image batch from `econInflationHowItAffectsYouHero` through
  `econTradeImportsAndExportsImportsAndExportsHero`, covering inflation effects
  and protection, prices, smart consumer value comparison, and the first Global
  Trade visuals.
- Normalized all final files to `1672x941`; used mapped ingest because several
  generated drafts were intentionally rejected before replacement.
- QA contact sheet passed after rejecting symbol bubbles/medical-cross motifs,
  coin faces/lightning marks, gauges/meters, star/brain/heart/coin marks,
  check/X/rating-like marks, a missing falling-prices visual, and an
  imports/exports service retry. Accepted assets have no readable text, labels,
  letters, digits, logos, UI screenshots, watermarks, price stickers, discount
  tags, coupon text, cash symbols, product labels, real country flags, map
  labels, port signs, shipping container text, tariff signs, customs stamps,
  import/export labels, trade-route map text, graph axes, or dashboard UI.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `810/1584`, with `774` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: remaining Global Trade visuals through
  `econTradeGlobalizationADeeplyConnectedWorldHero`, then Filmmaking & Video /
  Future Tech category starts and Filmmaking lessons through
  `filmSoundTheLayersOfFilmSoundHero`.

## Lesson visual quality redo - trade tail and filmmaking start complete

Completed on 2026-07-07:

- Replaced the 20-image batch from `econTradeAffectsPricesHero` through
  `filmSoundTheLayersOfFilmSoundHero`, covering the remaining Global Trade
  visuals, Filmmaking & Video and Future Tech category heroes, and Filmmaking
  lessons through sound layers.
- Normalized all final files to `1672x941`; used a mapped ingest because the
  accepted set mixed first-pass outputs with targeted retries.
- QA contact sheet passed after regenerating drafts with product/shelf label
  shapes, a framing subject that drifted off-brief, and one editing visual that
  looked too much like software UI. Accepted assets have no readable text,
  labels, letters, digits, logos, UI screenshots, watermarks, trade labels,
  country flags, map labels, shipping-container text, clapperboard lettering,
  timecode digits, camera brand marks, lens numbers, film-strip numbering,
  timeline UI text, subtitle lines, screenplay text, storyboard labels,
  waveform labels, or editing software UI chrome.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `830/1584`, with `754` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Filmmaking lesson tail from `filmDirectingHero` through
  `filmAnalyzingNoticeTheCraftHero`, then Future Tech lessons from
  `futuretechRoboticsHero` through
  `futuretechQuantumComputingBitsVsQubitsHero`.

## Lesson visual quality redo - filmmaking tail and future tech start complete

Completed on 2026-07-07:

- Replaced the 20-image batch from `filmDirectingHero` through
  `futuretechQuantumComputingBitsVsQubitsHero`, covering the Filmmaking lesson
  tail and Future Tech lessons for robotics, automation, drones, self-driving
  cars, VR/AR, and quantum computing.
- Normalized all final files to `1672x941`; used a mapped ingest because the
  accepted set mixed first-pass outputs with targeted retries.
- QA contact sheet passed after regenerating phone/app icon UI,
  play/app-like film-industry motifs, notebook/timeline UI clutter, and
  dashboard/chart screens in automation. Accepted assets have no readable text,
  labels, letters, digits, logos, UI screenshots, watermarks, director-chair
  lettering, clapperboard text, timecode, camera brand marks, lens numbers,
  poster text, theater signs, ticket text, streaming UI, review stars, robot
  labels, drone serial numbers, road signs, license plates, dashboard screens,
  VR/AR letters, binary digits, bit/qubit labels, formulas, equations, or chip
  markings.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `850/1584`, with `734` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Future Tech tail from `futuretechBiotechHero` through
  `futuretechSpaceTechSpaceTechInYourDailyHero`, then final-remaining category
  heroes and Parenting lessons through `parentingStagesOfChildhoodHero`.

## Lesson visual quality redo - future tech tail and parenting categories start complete

Completed on 2026-07-07:

- Replaced the 20-image batch from `futuretechBiotechHero` through
  `parentingStagesOfChildhoodHero`, covering the Future Tech tail, category
  heroes for Parenting, Philosophy, Productivity, Psychology, Real Estate,
  Sports, Sustainable Living, World Cuisines, and World Religions, plus the
  first Parenting lesson visuals.
- Normalized all final files to `1672x941`; used a mapped ingest because the
  accepted set mixed first-pass outputs with targeted retries.
- QA contact sheet passed after regenerating wearable app-icon badges,
  phone/map-pin UI cues in space-tech images, and a biotech monitor-like panel.
  Accepted assets have no readable text, labels, letters, digits, logos, UI
  screenshots, watermarks, DNA base letters, lab labels, test-tube labels,
  formula glyphs, medical crosses, 3D-printer interface text, wearable screen
  text, app icons, circular icon badges, phone UI, satellite labels, orbit
  numbers, map labels, country flags, coordinates, category emblem lettering,
  property signage, sale signs, price tags, menu text, restaurant signs,
  packaging text, scripture text, book text, growth-stage labels, age numbers,
  child-development chart labels, worksheet text, or report-card marks.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `870/1584`, with `714` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Parenting lessons from
  `parentingStagesOfChildhoodTheBroadStagesHero` through
  `parentingSelfCareYouCanTPourFromAnEmptyCupHero`, then Philosophy starts
  through `philosophyEthicsHero`.

## Lesson visual quality redo - parenting tail and philosophy start complete

Completed on 2026-07-07:

- Replaced the 20-image batch from
  `parentingStagesOfChildhoodTheBroadStagesHero` through
  `philosophyEthicsHero`, covering the Parenting lesson tail and the first
  Philosophy visuals.
- Normalized all final files to `1672x941`; used a mapped ingest because the
  accepted set mixed first-pass outputs with targeted retries.
- QA contact sheet passed after regenerating screen-time app/icon badge drift,
  an emotion-handling emoji/rating row, teen-years badge clutter, and a
  self-care digit-like mark. Accepted assets have no readable text, labels,
  letters, digits, logos, UI screenshots, watermarks, stage labels, age
  numbers, growth charts, worksheet text, report-card marks, punishment imagery,
  warning signs, checklist marks, book text, page writing, app icons, device UI,
  stopwatch digits, calendar numbers, emotion labels, mood charts, speech text,
  chat UI, myth/fact text, question marks, teen phone UI, school text, brain
  labels, self-care checklist text, philosophy book text, punctuation glyphs,
  ethical labels, or scales with lettered sides.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `890/1584`, with `694` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Philosophy tail from
  `philosophyEthicsDifferentLensesOnRightAndWrongHero` through
  `philosophyHowWeKnowKnowledgeVersusBeliefHero`, then Growth starts at
  `growthFocusUnderstandingAttentionHero`.

## Lesson visual quality redo - philosophy tail and growth start complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `philosophyEthicsDifferentLensesOnRightAndWrongHero` through
  `growthFocusUnderstandingAttentionHero`, covering the Philosophy lesson tail
  and the first Productivity & Self-Growth focus visual.
- Normalized all final files to `1672x941`; accepted the first-pass contact
  sheet because it stayed clean and readable across the whole batch.
- QA contact sheet passed with no readable text, labels, letters, digits, logos,
  UI screenshots, watermarks, question marks, trolley track labels, train
  numbers, stop signs, famous-name text, ancient scroll text, statue plaques,
  knowledge/belief labels, attention-app UI, focus timer digits, notification
  badges, productivity dashboard panels, chart axes, or worksheet clutter.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `910/1584`, with `674` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Growth visuals from
  `growthFocusUnderstandingAttentionAttentionIsLimitedHero` through
  `growthNotesPopularMethodsHero`.

## Lesson visual quality redo - growth focus and productivity foundations complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `growthFocusUnderstandingAttentionAttentionIsLimitedHero` through
  `growthNotesPopularMethodsHero`, covering the first Productivity &
  Self-Growth lesson visuals for focus, goals, habits, learning, notes, and
  time.
- Normalized all final files to `1672x941`; used a mapped ingest because
  `growthGoalsSmartGoalsHero` was regenerated after the first draft drifted
  into ruler/tick-mark visuals.
- QA contact sheet passed with no readable text, labels, letters, digits, logos,
  UI screenshots, watermarks, timer numbers, notification badges, dashboard
  panels, chart axes, SMART acronym letters, ruler marks, tick marks,
  checkboxes, calendar numbers, notebook writing, worksheet clutter, book text,
  app UI, or device screens.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `930/1584`, with `654` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Growth continuation from
  `growthNotesPopularMethodsLinearMethodsHero` through
  `growthHabitsBreakingBadOnesHero`.

## Lesson visual quality redo - growth continuation and procrastination complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `growthNotesPopularMethodsLinearMethodsHero` through
  `growthHabitsBreakingBadOnesHero`, covering Productivity & Self-Growth
  visuals for note methods, prioritization, distractions, goals, habits,
  spaced repetition, digital/paper notes, procrastination, deep work, and
  motivation.
- Normalized all final files to `1672x941`; used a mapped ingest because
  `growthFocusManagingDistractionsHero` was regenerated to remove
  app/social-style icons and `growthTimeProcrastinationItSEmotionalNotLazyHero`
  was regenerated to remove a face-like cloud.
- QA contact sheet passed with no readable text, labels, letters, digits, logos,
  UI screenshots, watermarks, quadrant labels, matrix labels, axis labels,
  clocks, calendars, timer numbers, device UI, app icons, social icons,
  notification badges, handwriting, ruled page text, checklist marks, face
  icons, emoji, mood charts, dashboard panels, or chart axes.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `950/1584`, with `634` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Growth tail from
  `growthHabitsBreakingBadOnesMakeItHarderRemoveTheCueHero` through
  `growthTimeCommonTrapsTheBigTimeTrapsHero`, then Psychology starts at
  `psychEmotionsWhatTheyAreHero`.

## Lesson visual quality redo - growth tail and psychology start complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `growthHabitsBreakingBadOnesMakeItHarderRemoveTheCueHero` through
  `psychEmotionsWhatTheyAreHero`, completing the current Productivity &
  Self-Growth run and starting Psychology & Mind.
- Normalized all final files to `1672x941`; accepted the first-pass contact
  sheet because it stayed free of text, numbers, app UI, schedule labels, and
  emoji/faces.
- QA contact sheet passed with no readable text, labels, letters, digits, logos,
  UI screenshots, watermarks, calendar dates, clock faces, timer numbers,
  schedule labels, tracker dashboards, chart axes, progress graphs, habit
  tracker UI, app screens, handwriting, page lines, flashcard text, book
  writing, formula marks, folder labels, therapy worksheet marks, emoji, faces,
  mood charts, brain labels, warning signs, or prohibition symbols.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `970/1584`, with `614` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Psychology visuals from
  `psychEmotionsWhatTheyAreMoreThanJustFeelingsHero` through
  `psychMotivationWhyItFluctuatesHero`.

## Lesson visual quality redo - psychology emotions, memory, motivation complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `psychEmotionsWhatTheyAreMoreThanJustFeelingsHero` through
  `psychMotivationWhyItFluctuatesHero`, covering Psychology & Mind visuals for
  emotions, memory, motivation, relationships, communication, and forgetting.
- Normalized all final files to `1672x941`; used a mapped ingest because
  `psychEmotionsWhatTheyAreMoreThanJustFeelingsHero` was regenerated to remove
  waveform/chart-like marks and `psychEmotionsWhyWeHaveThemHero` was
  regenerated to remove person/symbol icons inside emotion orbs.
- QA contact sheet passed with no readable text, labels, letters, digits, logos,
  UI screenshots, watermarks, emoji, faces, mood charts, therapy worksheet
  marks, brain labels, chart axes, graph labels, app UI, speech text, chat UI,
  category labels, stage numbers, motivational poster words, dashboard panels,
  battery meters, trophy labels, or medal text.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `990/1584`, with `594` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Psychology tail from
  `psychMotivationWhyItFluctuatesMotivationIsNaturallyVariableHero` through
  `psychRelationshipsHealthyVsUnhealthySignsOfAHealthyRelationshipHero`, then
  Real Estate starts at `realestatePropertyValueHero`.

## Lesson visual quality redo - psychology tail and real estate start complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `psychMotivationWhyItFluctuatesMotivationIsNaturallyVariableHero` through
  `realestatePropertyValueHero`, completing the current Psychology & Mind run
  and starting Real Estate & Property.
- Normalized all final files to `1672x941`; used a mapped ingest because
  `psychEmotionsEmotionalIntelligenceHero` was regenerated to remove
  heart/icon drift, `psychMotivationMythsCommonMotivationMythsBustedHero` was
  regenerated to remove object icons in fog bubbles, and
  `realestatePropertyValueHero` was regenerated to remove map-pin/shield/signage
  style factor icons.
- QA contact sheet passed with no readable text, labels, letters, digits, logos,
  UI screenshots, watermarks, EQ acronyms, heart icons, puzzle icons, emoji,
  faces, mood charts, component labels, myth/fact text, question marks,
  checkmarks, X marks, dashboards, battery meters, warning signs, chat UI,
  argument speech text, real-estate signs, price tags, map labels, street signs,
  or sale signage.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1010/1584`, with `574` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Real Estate visuals from
  `realestatePropertyValueWhatDrivesValueHero` through
  `realestateBuyerMistakesMoneyAndEmotionMistakesHero`, then Fitness starts at
  `fitnessHowMusclesGrowHero`.

## Lesson visual quality redo - real estate continuation and fitness start complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `realestatePropertyValueWhatDrivesValueHero` through
  `fitnessHowMusclesGrowHero`, covering the Real Estate & Property continuation
  and the first Sports & Fitness visual.
- Normalized all final files to `1672x941`; used an ordered mapped ingest
  because several first-pass outputs were rejected and targeted retries were
  accepted instead.
- QA contact sheet passed after regenerating market profile-icon drift, landlord
  face/app-badge drift, buyer-mistakes faces/coin stacks, and heart-icon drift
  in the money/emotion image. Accepted assets have no readable text, labels,
  letters, digits, logos, UI screenshots, watermarks, map pins, real-estate
  signs, sale signs, price tags, document pseudo text, form fields, receipt
  marks, currency symbols, chart axes, profile/app icons, faces, emoji,
  checkmarks, X marks, warning labels, rental signs, calendar dates, chat UI, or
  medical/anatomy labels.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1030/1584`, with `554` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  batch: Fitness continuation from
  `fitnessHowMusclesGrowStressRepairAdaptHero` through
  `fitnessStayingMotivatedMotivationIsUnreliableHero`, then Sustainable Living
  starts at `sustainReducingWasteHero`.

## Lesson visual quality redo - fitness continuation and sustainable start complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `fitnessHowMusclesGrowStressRepairAdaptHero` through
  `sustainReducingWasteHero`, completing the current Sports & Fitness run and
  starting Sustainable Living.
- Recalibrated against stronger previous visuals before generating. The accepted
  direction is premium dark cinematic miniature/sculptural concept art with one
  dominant metaphor, richer glow/depth, and no flat icon-board look.
- Normalized all final files to `1672x941`; used an ordered mapped ingest
  because targeted retries replaced first-pass outputs for food fuel, science of
  training, body adaptation, and goal-setting.
- QA contact sheet passed with no readable text, labels, letters, digits, logos,
  UI screenshots, watermarks, anatomy labels, medical chart marks, rep counters,
  timer digits, wearable screens, scoreboards, jersey numbers, nutrition labels,
  packaging text, brand marks, goal acronyms, trophy text, calendar dates, or
  recycling/bin labels.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1050/1584`, with `534` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  Sustainable Living batch from `sustainReducingWasteTheOrderThatMattersHero`
  through `sustainGreenwashingHero`.

## Lesson visual quality redo - sustainable continuation complete

Completed on 2026-07-08:

- Replaced the 20-image Sustainable Living batch from
  `sustainReducingWasteTheOrderThatMattersHero` through
  `sustainGreenwashingHero`.
- Kept the recalibrated premium dark cinematic/sculptural style: one dominant
  metaphor, rich glow/depth, no flat icon-board look.
- Normalized all final files to `1672x941`; first-pass contact sheet was
  accepted with no targeted retries.
- QA contact sheet passed with no readable text, labels, letters, digits, logos,
  UI screenshots, watermarks, recycling text, bin labels, plastic packaging
  text, product labels, energy rating labels, appliance labels, water-meter
  numbers, eco certification marks, brand logos, checklist marks, fashion tags,
  clothing labels, store signage, food packaging labels, carbon numbers, factory
  signage, greenwashing badges, leaf-check logos, circular-arrow text, or price
  tags.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1070/1584`, with `514` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next batch:
  greenwashing tactics plus World Cuisines from
  `sustainGreenwashingCommonGreenwashingTacticsHero` through
  `cuisineTechniquesByRegionHero`.

## Lesson visual quality redo - greenwashing tail and cuisines bridge complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `sustainGreenwashingCommonGreenwashingTacticsHero` through
  `cuisineTechniquesByRegionHero`, crossing from Sustainable Living into World
  Cuisines.
- Kept the higher quality bar. Cuisine visuals are richer and more tactile than
  the abstract batches, but still use the dark cinematic app-card treatment and
  avoid signs, menus, flags, and recipe text.
- Normalized all final files to `1672x941`; first-pass contact sheet was
  accepted with no targeted retries.
- QA contact sheet passed with no readable text, labels, letters, digits, logos,
  UI screenshots, watermarks, menu text, restaurant signs, packaging labels,
  chef coat logos, country flags, map labels, decorative script, price tags,
  recipe-card writing, numbered recipe steps, brand marks, street signs,
  storefront signage, plate labels, or culturally specific text-like markings.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1090/1584`, with `494` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next batch:
  `cuisineTechniquesByRegionHowTechniquesShapeCuisinesHero` plus the first World
  Religions visuals through `religionRitualsHero`.

## Lesson visual quality redo - cuisines and religions bridge complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `cuisineTechniquesByRegionHowTechniquesShapeCuisinesHero` through
  `religionRitualsHero`, crossing from World Cuisines into World Religions.
- Kept the recalibrated premium dark cinematic/sculptural style, with religion
  visuals handled as respectful abstract objects, architecture silhouettes,
  paths, lights, threads, gathering circles, nature elements, and unlabeled
  symbolic forms.
- Normalized all final files to `1672x941`; targeted retries replaced the weak
  Islam core-beliefs and Indigenous/Folk first-pass outputs before ingest.
- QA contact sheet passed with no readable text, labels, letters, digits, logos,
  UI screenshots, watermarks, scripture text, holy-book writing, prayer-card
  writing, plaques, temple/church/mosque/synagogue signage, named figures, real
  flags, map labels, denomination text, symbol captions, brand-like icons, UI
  badges, or decorative marks that read as script.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1110/1584`, with `474` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  manifest-order batch from `religionRitualsWhatRitualsDoHero` through
  `govtPoliticalIdeologiesHero`.

## Lesson visual quality redo - religion, biology, and government bridge complete

Completed on 2026-07-08:

- Replaced the 20-image batch from `religionRitualsWhatRitualsDoHero` through
  `govtPoliticalIdeologiesHero`, covering the final rituals visual, category
  bridges for Genetics/DNA, Reproduction Basics, Government & Politics, and
  History & the World, plus the first Government & Politics lessons.
- Used a mixed accepted set after QA: 14 weak/off-topic first-pass outputs were
  regenerated, especially DNA, fertilization, history, constitution, democracy,
  government-system, and lawmaking images.
- Normalized all final files to `1672x941`; the final accepted sheet is
  `image-pipeline/qa-religion-bio-gov-batch-accepted.png`.
- QA passed with no readable text, labels, letters, digits, logos, UI
  screenshots, watermarks, DNA base letters, chromosome labels, medical/anatomy
  labels, baby/embryo labels, clinical forms, constitution text, law document
  text, ballot text, voting numbers, flags, map labels, seals/logos, podium
  signage, ideology labels, chart axes, or readable civic/biology markings.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1130/1584`, with `454` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  manifest-order batch from
  `govtPoliticalIdeologiesWhatIdeologiesDisagreeAboutHero` through
  `histDigitalSmartphoneHero`.

## Lesson visual quality redo - government tail and digital history complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `govtPoliticalIdeologiesWhatIdeologiesDisagreeAboutHero` through
  `histDigitalSmartphoneHero`, finishing the current Government & Politics run
  and starting the History/Digital Revolution visuals.
- Corrected the QA workflow by explicitly setting `CODEX_GENERATED_IMAGES_DIR`
  to `C:\Users\AhmedAmineFEKI\.codex\generated_images\019f409a-3c9d-7a93-9ef3-2a872ed214d9`
  before rendering the contact sheet and ingesting. Without that env var, the
  helper defaults to an older generated-image folder.
- Normalized all final files to `1672x941`; the accepted sheet is
  `image-pipeline/qa-gov-digital-batch-accepted.png`.
- QA passed with no readable text, labels, letters, digits, logos, UI
  screenshots, watermarks, propaganda poster text, newspaper headlines,
  broadcast captions, social-media UI, ballot labels, voting numbers, branch
  labels, UN/emblem seals, real country flags, national maps, party logos,
  campaign signs, computer terminal text, keyboard letters, screen UI, app
  icons, website chrome, code text, binary digits, chip labels, phone-brand
  marks, or readable technology markings.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1150/1584`, with `434` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  manifest-order batch from `histDigitalSmartphoneAComputerInEveryPocketHero`
  through `histIndustrialWhatItWasHero`.

## Lesson visual quality redo - history and industrial revolution complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `histDigitalSmartphoneAComputerInEveryPocketHero` through
  `histIndustrialWhatItWasHero`, continuing History & the World through major
  turning points and the Industrial Revolution.
- Regenerated `histDigitalSmartphoneAComputerInEveryPocketHero` after the first
  pass introduced text-prone typewriter/book/calculator props. The accepted
  replacement uses one blank smartphone with abstract internals.
- Normalized all final files to `1672x941`; the accepted sheet is
  `image-pipeline/qa-history-industrial-batch-accepted.png`.
- QA passed with no readable text, labels, letters, digits, logos, UI
  screenshots, watermarks, date labels, timeline text, map labels, country
  flags, propaganda posters, newspaper text, factory signs, machine labels,
  gauge numbers, patent drawings with text, instruction plaques, street signs,
  product branding, tool labels, book/document writing, computer UI, app icons,
  keyboard letters, or readable historical/industrial markings.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1170/1584`, with `414` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  manifest-order batch from `histIndustrialWhatItWasFromHandToMachineHero`
  through `maintenanceHero`.

## Lesson visual quality redo - religion, body, and home bridge complete

Completed on 2026-07-08:

- Replaced the 20-image batch from
  `histIndustrialWhatItWasFromHandToMachineHero` through `maintenanceHero`,
  crossing from final Industrial Revolution content into historical religion,
  heart/circulation, digestion, Home Repairs, and Plumbing category bridges.
- Regenerated `histReligionsOtherTraditionsHero`,
  `histReligionsUnderstandingHero`, `doublePumpHero`, `digestiveJourneyHero`,
  and `catHomeRepairsHero` to remove glyph-like stones, figure/icon clutter,
  ECG waveforms, notebook/card markings, and chalkboard-style fake writing.
- Normalized all final files to `1672x941`; the accepted sheet is
  `image-pipeline/qa-religion-body-home-batch-accepted.png`.
- QA passed with no readable text, labels, letters, digits, logos, UI
  screenshots, watermarks, scripture text, holy-book writing, prayer-card
  writing, plaques, religious signage, denomination labels, named figures,
  anatomy labels, medical chart marks, digestion labels, plumbing pipe labels,
  tool labels, appliance labels, hardware packaging, warning stickers,
  measurement numbers, repair-manual text, home inspection forms, readable
  signage, or pseudo-writing.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1190/1584`, with `394` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  manifest-order batch from `preventiveFix` through `catHowThingsWorkHero`.

## Lesson visual quality redo - home repairs and plumbing complete

Completed on 2026-07-09:

- Replaced the 20-image batch from `preventiveFix` through
  `catHowThingsWorkHero`, continuing Home Repairs and Plumbing and adding the
  How Things Work category bridge.
- Regenerated `preventiveFix`, `doorFixHero`, and `mainValveLocalValve` to
  remove UI-like callout-circle drift and keep the visuals physical rather than
  diagrammatic.
- Normalized all final files to `1672x941`; the accepted sheet is
  `image-pipeline/qa-home-plumbing-batch-accepted.png`.
- QA passed with no readable text, labels, letters, digits, logos, UI
  screenshots, watermarks, paint-can labels, sandpaper labels, door hardware
  packaging, level/ruler numbers, measuring-tape numbers, leak-warning labels,
  water-meter numbers, shutoff-valve labels, pipe-direction labels, toilet tank
  labels, plumber van signage, invoice text, permit forms, service badges,
  tool-brand marks, readable workshop, repair, or plumbing markings.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1210/1584`, with `374` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  manifest-order batch from `catLanguagesLinguisticsHero` through
  `howworksInternetPhysicalHero`.

## Lesson visual quality redo - languages and how things work complete

Completed on 2026-07-09:

- Replaced the 20-image batch from `catLanguagesLinguisticsHero` through
  `howworksInternetPhysicalHero`, covering the Languages & Linguistics category
  bridge and How Things Work visuals for planes, cars, rockets, ships, bridges,
  skyscrapers, elevators, engines, refrigeration, and physical internet.
- Accepted the first corrected contact sheet; the assets used physical cutaways,
  airflow/force/energy light paths, and blank engineering surfaces instead of
  text-heavy diagrams.
- Normalized all final files to `1672x941`; the accepted sheet is
  `image-pipeline/qa-languages-howworks-batch-accepted.png`.
- QA passed with no readable text, labels, letters, digits, logos, UI
  screenshots, watermarks, alphabet letters, language labels, map labels,
  aviation labels, force arrows with words, dashboard text, license plates,
  gauges with numbers, rocket markings, ship hull names, bridge labels,
  skyscraper signage, elevator floor numbers, engine labels, thermostat numbers,
  refrigeration diagrams with text, cable labels, network port labels, or
  readable engineering/infrastructure markings.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1230/1584`, with `354` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  manifest-order batch from
  `howworksInternetPhysicalCablesIncludingUnderTheOceansHero` through
  `langDeadEndangeredHero`.

## Lesson visual quality redo - GPS and languages complete

Completed on 2026-07-09:

- Replaced the 20-image batch from
  `howworksInternetPhysicalCablesIncludingUnderTheOceansHero` through
  `langDeadEndangeredHero`, bridging physical internet/GPS into Languages &
  Linguistics lesson visuals.
- Regenerated `langWritingSystemsDifferentApproachesHero`,
  `langChildrenLearnLanguageHero`,
  `langChildrenLearnLanguageEffortlessAbsorptionHero`,
  `langAccentsDialectsAccentsVsDialectsHero`, `langSignLanguageHero`, and
  `langSignLanguageRealCompleteLanguagesHero` to remove glyph-like pictograms,
  icon-board panels, face/icon rows, and UI-like sign-language markers.
- Normalized all final files to `1672x941`; the accepted sheet is
  `image-pipeline/qa-gps-languages-batch-accepted.png`.
- QA passed with no readable text, labels, letters, digits, logos, UI
  screenshots, watermarks, cable labels, map labels, satellite labels, GPS
  coordinate numbers, alphabet letters, sample words, dictionary entries, book
  text, notebook writing, writing-system glyphs, family-tree labels, etymology
  text, worksheet marks, app UI, flashcard text, accent/dialect labels,
  hand-sign captions, endangered-language map labels, or readable linguistic
  markings.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1250/1584`, with `334` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  manifest-order batch from `langDeadEndangeredHowAndWhyLanguagesDieHero`
  through `movingOutHero`.

## Lesson visual quality redo - language and practical admin bridge complete

Completed on 2026-07-09:

- Replaced the 20-image batch from
  `langDeadEndangeredHowAndWhyLanguagesDieHero` through `movingOutHero`,
  covering the Languages & Linguistics tail, Insurance Claims category/lesson
  visuals, and the first Renting an Apartment lesson visuals.
- Rejected and regenerated `filingClaimHero` for a checkmark shield,
  `largeLossClaim` for a coin portrait, `rentalLivingHero` for an app-like
  house badge, and `movingOutHero` for coin imprints.
- Normalized all final files to `1672x941`; the accepted sheet is
  `image-pipeline/qa-language-admin-bridge-batch-accepted.png`.
- QA passed with no readable text, labels, letters, digits, logos, UI
  screenshots, watermarks, translation text, dictionary text, sample words,
  document writing, insurance policy text, claim numbers, form fields,
  checkboxes, receipt text, evidence labels, appeal letters, photo timestamps,
  apartment lease text, deposit forms, repair request text, move-in checklist
  marks, address numbers, key-tag labels, or readable legal/insurance/rental
  markings.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1270/1584`, with `314` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  manifest-order batch from `cleanExitPhotos` through `passwordManagerHero`.

## Lesson visual quality redo - renting, internet, and passwords complete

Completed on 2026-07-10:

- Replaced the 20-image batch from `cleanExitPhotos` through
  `passwordManagerHero`, completing the Renting an Apartment tail and covering
  the first How the Internet Works and Passwords & Accounts visuals.
- Rejected and regenerated `cleanExitPhotos` for tiny camera-dial lettering,
  `leaseHero` for document pseudo-text lines, `leaseTerms` for a segmented
  app-like layout, and `catInternetHero` for tiny device-screen details.
- Normalized all final files to `1672x941`; the accepted sheet is
  `image-pipeline/qa-renting-internet-passwords-batch-accepted.png`.
- QA passed with no readable text, letters, digits, document pseudo text,
  contract fine print, signatures, checkboxes, address numbers, key-tag labels,
  moving-box labels, phone/camera UI, photo timestamps, app UI, browser chrome,
  URL text, keyboard letters, code, binary digits, network/server/router labels,
  password fields, account/profile UI, app or badge icons, logos, currency
  symbols, coin imprints, watermarks, or readable rental, legal, internet,
  account, or cybersecurity markings.
- Registered the 20 new image keys in `src/constants/images.ts`; manifest
  coverage advanced to `1290/1584`, with `294` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  manifest-order batch from `encryptedVault` through `betterBrewingHero`.

## Lesson visual quality redo - passwords, kitchen, and coffee bridge complete

Completed on 2026-07-11:

- Replaced the 20-image batch from `encryptedVault` through
  `betterBrewingHero`, completing Passwords & Accounts and covering Kitchen
  Essentials plus the opening Coffee & Tea Basics visual.
- Rejected and regenerated `passwordDominoRisk` for engraving-like key marks,
  `starterKitchenKit` for button-like gadget markings, `miseEnPlaceCleanFlow`
  for faint watermark-like corner marks, and `panTaskMatch` for engraved
  cookware handles.
- All accepted files are `1672x941`; the reviewed contact sheet is
  `image-pipeline/qa-passwords-kitchen-coffee-batch-accepted.png`.
- QA passed with no readable text, letters, digits, password characters,
  login/account UI, labels, logos, watermarks, recipe or cookbook writing,
  measuring marks, knife branding, appliance controls, cookware labels,
  packaging text, jar or spice labels, coffee-bag text, tea-tag writing, cafe
  branding, certification marks, currency symbols, or coin imprints.
- Registered all 20 image keys in `src/constants/images.ts`; manifest coverage
  advanced to `1310/1584`, with `274` pending.
- `image-pipeline/quality-regeneration-progress.md` now points to the next
  manifest-order batch from `consistentBrew` through `nutritionLabelHero`.

## Lesson visual quality redo - nutrition and smartphone batch of 10

Completed on 2026-07-11:

- Switched the quality pass to accepted batches of 10 and completed the batch
  from `hiddenSugarSalt` through `phoneSecurityHero`.
- Rejected and regenerated `nutritionLabelHero` for speech-bubble-like UI
  shapes, `clearPhoneStorage` for phone ports/buttons, and `batterySaver` for a
  side button.
- All accepted files are `1672x941`; the reviewed contact sheet is
  `image-pipeline/qa-nutrition-smartphone-batch10-accepted.png`.
- QA passed with no readable text, digits, nutrition rows, package labels,
  barcodes, health claims, app icons, screen UI, status bars, notifications,
  phone ports/buttons, logos, checkmarks, watermarks, or pseudo-writing.
- Registered all 10 image keys in `src/constants/images.ts`; manifest coverage
  advanced to `1338/1584`, with `246` pending.
- The next 10-image batch runs from `screenLockHero` through
  `lawEmploymentRightsHero`.

## Lesson visual quality redo - smartphone and law batch of 10

Completed on 2026-07-11:

- Completed the accepted 10-image batch from `screenLockHero` through
  `lawEmploymentRightsHero`, finishing Smartphone Skills and beginning Law &
  Your Rights plus Logic & Critical Thinking.
- Rejected and regenerated `usefulPhoneFeaturesHero` for detailed camera
  controls and `accessibilitySettings` for a phone port and fingerprint-like
  interface forms.
- All accepted files are `1672x941`; the reviewed contact sheet is
  `image-pipeline/qa-smartphone-law-batch10-accepted.png`.
- QA passed with no readable text, digits, phone UI, app icons, status bars,
  legal writing, seals, badges, law-book text, logos, checkmarks, watermarks,
  or pseudo-writing.
- Registered all 10 image keys; manifest coverage advanced to `1348/1584`,
  with `236` pending.
- The next 10-image batch runs from
  `lawEmploymentRightsCommonWorkerProtectionsHero` through
  `lawPrivacyDataRightsHero`.

## Lesson visual quality redo - law rights batch of 10

Completed on 2026-07-12:

- Completed the batch from `lawEmploymentRightsCommonWorkerProtectionsHero`
  through `lawPrivacyDataRightsHero`.
- Regenerated the worker-protections visual because its first draft used rising
  chart bars instead of equal protections.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-law-rights-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1358/1584`, with `226` pending.
- Next batch runs from `lawPrivacyDataRightsRightsYouMayHaveHero` through
  `logicEvaluatingEvidenceHero`.

## Lesson visual quality redo - law and logic batch of 10

Completed on 2026-07-12:

- Completed the batch from `lawPrivacyDataRightsRightsYouMayHaveHero` through
  `logicEvaluatingEvidenceHero`.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-law-logic-batch10-accepted.png`.
- QA passed for clean compositions with no readable or pseudo-writing, legal
  forms, signatures, seals, badges, logos, UI, or watermarks.
- Registered all keys; manifest coverage is `1368/1584`, with `216` pending.
- Next batch runs from `logicEvaluatingEvidenceNotAllEvidenceIsEqualHero`
  through `logicHealthySkepticismHero`.
- The first three source drafts for that next batch have been generated and
  await individual QA/ingestion: `logicEvaluatingEvidenceNotAllEvidenceIsEqualHero`,
  `logicScientificMethodHero`, and
  `logicScientificMethodTestIdeasAgainstRealityHero`.

## Lesson visual quality redo - logic methods batch of 10

Completed on 2026-07-12:

- Completed the batch from `logicEvaluatingEvidenceNotAllEvidenceIsEqualHero`
  through `logicHealthySkepticismHero`.
- Rejected and regenerated `logicScientificMethodHero` because the first draft
  formed a punctuation-like silhouette, and `logicProblemSolvingHero` because
  the first draft included pseudo-writing on paper.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-logic-methods-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1378/1584`, with `206` pending.
- Next batch runs from `logicHealthySkepticismTheBalanceToStrikeHero` through
  `listeningBarriersHero`.

## Lesson visual quality redo - logic and listening batch of 10

Completed on 2026-07-12:

- Completed the batch from `logicHealthySkepticismTheBalanceToStrikeHero`
  through `listeningBarriersHero`, including both communication category heroes.
- Rejected and regenerated `logicCorrelationCausationHero` because the first
  draft included a partially visible marked book.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-logic-listening-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1388/1584`, with `196` pending.
- Next batch runs from `internalListeningBarriersHero` through
  `stayingCalmConflictHero`.

## Lesson visual quality redo - listening and conflict batch of 10

Completed on 2026-07-12:

- Completed the batch from `internalListeningBarriersHero` through
  `stayingCalmConflictHero`.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-listening-conflict-batch10-accepted.png`.
- QA passed with no readable text, pseudo-writing, screen content, labels,
  logos, or watermarks, and each image communicates its named mechanism.
- Registered all keys; manifest coverage is `1398/1584`, with `186` pending.
- Next batch runs from `floodedPauseHero` through `marketingWhatItIsHero`.

## Lesson visual quality redo - conflict and marketing bridge batch of 10

Completed on 2026-07-12:

- Completed the batch from `floodedPauseHero` through `marketingWhatItIsHero`,
  including the Marketing & Branding and Math Concepts category heroes.
- Rejected and regenerated `marketingWhatItIsHero` because the first draft
  introduced a tiny product mark and icon-like audience labels.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-conflict-marketing-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1408/1584`, with `176` pending.
- Next batch runs from `marketingWhatItIsMoreThanAdvertisingHero` through
  `marketingSeoHero`.

## Lesson visual quality redo - marketing batch of 10

Completed on 2026-07-12:

- Completed the batch from `marketingWhatItIsMoreThanAdvertisingHero` through
  `marketingSeoHero`.
- Rejected and regenerated
  `marketingSocialMediaEngagementOverBroadcastingHero` because the first draft
  introduced heart/star symbols and arrows.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-marketing-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1418/1584`, with `166` pending.
- Next batch runs from `marketingSeoHowSearchEnginesWorkHero` through
  `mathAlgebraHero`.

## Lesson visual quality redo - marketing and math bridge batch of 10

Completed on 2026-07-12:

- Completed the batch from `marketingSeoHowSearchEnginesWorkHero` through
  `mathAlgebraHero`, finishing the Marketing & Branding topic and beginning
  Math Concepts.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-marketing-math-batch10-accepted.png`.
- QA passed with no readable text, pseudo-writing, search/email UI, currency
  symbols, equations, labels, logos, or watermarks.
- Registered all keys; manifest coverage is `1428/1584`, with `156` pending.
- Next batch runs from `mathAlgebraFindingTheUnknownHero` through
  `mathPrimeNumbersHero`.

## Lesson visual quality redo - math concepts batch of 10

Completed on 2026-07-12:

- Completed the batch from `mathAlgebraFindingTheUnknownHero` through
  `mathPrimeNumbersHero`.
- Rejected and regenerated `mathTrigonometryHero` for scale/tick-like markings
  and `mathFamousNumbersPiTheCircleNumberHero` for a marked background globe.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-math-concepts-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1438/1584`, with `146` pending.
- Next batch runs from `mathPrimeNumbersTheBuildingBlocksOfNumbersHero` through
  `catMedicinePublicHealthHero`.

## Lesson visual quality redo - math and medicine bridge batch of 10

Completed on 2026-07-12:

- Completed the batch from `mathPrimeNumbersTheBuildingBlocksOfNumbersHero`
  through `catMedicinePublicHealthHero`, finishing Math Concepts and beginning
  Medicine & Public Health.
- Regenerated the prime-building-block visual twice until the visible prime
  groups and composite arrays were exact; regenerated `mathHistoryHero` to
  remove tally marks.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-math-medicine-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1448/1584`, with `136` pending.
- Next batch runs from `medicineVaccinesHero` through
  `medicineHeartDiseaseHowItDevelopsHero`.

## Lesson visual quality redo - medicine foundations batch of 10

Completed on 2026-07-12:

- Completed the batch from `medicineVaccinesHero` through
  `medicineHeartDiseaseHowItDevelopsHero`.
- Rejected and regenerated `medicineChronicDiseasesHero` to remove medical UI,
  and `medicineHeartDiseaseHero` to remove a numbered gauge-like device.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-medicine-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1458/1584`, with `126` pending.
- Next batch runs from `medicineCancerHero` through
  `medicineHistoryFromSuperstitionToScienceHero`.

## Lesson visual quality redo - medicine clinical batch of 10

Completed on 2026-07-12:

- Completed the batch from `medicineCancerHero` through
  `medicineHistoryFromSuperstitionToScienceHero`.
- Regenerated the urgency visual to remove blood, the medical-tests visual to
  remove scan-panel artifacts, and both history visuals to remove illustrated
  pages and pseudo-writing.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-medicine-clinical-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1468/1584`, with `116` pending.
- Next batch runs from `catMedicinesHero` through `antibioticResistanceHero`.

## Lesson visual quality redo - medicines and brain bridge batch of 10

Completed on 2026-07-12:

- Completed the batch from `catMedicinesHero` through
  `antibioticResistanceHero`, finishing the medicine fundamentals sequence and
  beginning the body/brain content.
- Rejected and regenerated `antibioticResistanceHero` because the first draft's
  cracked rock enclosure obscured the biological selection mechanism.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-medicines-brain-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1478/1584`, with `106` pending.
- Next batch runs from `sideEffectsHero` through `reflexShortcutHero`.

## Lesson visual quality redo - body systems batch of 10

Completed on 2026-07-12:

- Completed the batch from `sideEffectsHero` through `reflexShortcutHero`,
  covering side effects, brain signaling, muscles and bones, and the nervous
  system.
- Rejected and regenerated `bonesLivingTissueHero` because the initial repair
  site formed a bulbous mass that could be mistaken for pathology.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-body-systems-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1488/1584`, with `96` pending.
- Next batch runs from `catMusicAudioHero` through
  `musicMelodyHarmonyMelodyTheTuneHero`.

## Lesson visual quality redo - music foundations batch of 10

Completed on 2026-07-12:

- Completed the batch from `catMusicAudioHero` through
  `musicMelodyHarmonyMelodyTheTuneHero`.
- Regenerated both reading-music visuals because the first drafts rendered six
  staff lines instead of five; regenerated the tempo visual twice to replace
  mechanically invalid metronomes with clear laboratory pendulums.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-music-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1498/1584`, with `86` pending.
- Next batch runs from `musicHowInstrumentsSoundHero` through
  `musicSingingTheVoiceAsAnInstrumentHero`.

## Lesson visual quality redo - music sound and production batch of 10

Completed on 2026-07-12:

- Completed the batch from `musicHowInstrumentsSoundHero` through
  `musicSingingTheVoiceAsAnInstrumentHero`.
- Regenerated `musicGenresWhatDefinesAGenreHero` twice to remove panel-like UI,
  pad controls, and sheet music; regenerated
  `musicProductionFromSoundsToATrackHero` to replace stacked tape machines and
  decorative waveforms with one physical analog signal chain.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-music-sound-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1508/1584`, with `76` pending.
- Next batch runs from `musicIndustryHero` through
  `dataProbabilityWhatItIsTheScaleOfLikelihoodHero`.

## Lesson visual quality redo - music industry and data bridge batch of 10

Completed on 2026-07-13:

- Completed the batch from `musicIndustryHero` through
  `dataProbabilityWhatItIsTheScaleOfLikelihoodHero`.
- Regenerated five arrow/screen-bearing drafts. The exact “per hundred” visual
  required several fresh generations and precision-edit attempts before a
  countably exact solution was accepted: four five-by-five blocks, one blue and
  three gray.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-music-data-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1518/1584`, with `66` pending.
- Next batch runs from `dataStatisticsWhatTheyAreHero` through
  `dataProbabilityCalculatingSimpleTheBasicFormulaHero`.

## Lesson visual quality redo - data calculations batch of 10

Completed on 2026-07-13:

- Completed the batch from `dataStatisticsWhatTheyAreHero` through
  `dataProbabilityCalculatingSimpleTheBasicFormulaHero`.
- Rejected and regenerated all three count-sensitive drafts: the percentage
  building-block visual initially used nine tiles per group, the simple
  probability tray initially had sixteen positions, and the formula visual
  initially showed fifteen balls. The accepted replacements are countably
  exact: 1/10, 5/10, and 10/10 groups plus two separate 3-of-12 trays.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-data-calculations-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1528/1584`, with `56` pending.
- Next batch runs from `dataStatisticsAveragesHero` through
  `dataProbabilityIndependentEventsIndependentEventsHaveNoMemoryHero`.

## Lesson visual quality redo - averages, multiplication, and probability batch of 10

Completed on 2026-07-13:

- Completed the batch from `dataStatisticsAveragesHero` through
  `dataProbabilityIndependentEventsIndependentEventsHaveNoMemoryHero`.
- Rejected count-inaccurate drafts for the three averages, multiplication,
  multiplication building blocks, and percentage changes. Regenerated or
  safely reframed only after verifying exact groups: four groups of five,
  10- and 25-cube building blocks, 12/10/8 change groups, and a 10-position
  original beside 8 filled plus 2 empty positions.
- Regenerated the chart-scale concept until the baseline/viewing-window idea
  was physically coherent, and verified that the independent-event visuals do
  not imply causal influence or memory between trials.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-data-averages-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1538/1584`, with `46` pending.
- Next batch runs from `dataStatisticsHowTheyMisleadHero` through
  `dataProbabilityRiskInRealLifeFeelingVsRealityHero`.

## Lesson visual quality redo - misleading data, estimation, percentages, and risk batch of 10

Completed on 2026-07-13:

- Completed the batch from `dataStatisticsHowTheyMisleadHero` through
  `dataProbabilityRiskInRealLifeFeelingVsRealityHero`.
- Verified hidden-context, biased-sample, cherry-picking, cropped-baseline, and
  mirror-distortion concepts without readable labels or fake interfaces.
- Rejected inaccurate 25-position percentage, 21-token money, and 36-position
  risk drafts. Accepted replacements use an exact removed quarter, an exact
  4x5 money tray with a five-token row, a 5x8 risk board with three rare
  outcomes, and a 4x5 feeling-versus-frequency grid with one rare outcome.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-data-misleading-risk-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1548/1584`, with `36` pending.
- Next batch runs from `dataStatisticsCorrelationCausationHero` through
  `dataProbabilityMythsCommonProbabilityMythsBustedHero`.

## Lesson visual quality redo - correlation, clear charts, mental math, and myths batch of 10

Completed on 2026-07-13:

- Completed the batch from `dataStatisticsCorrelationCausationHero` through
  `dataProbabilityMythsCommonProbabilityMythsBustedHero`.
- Used separate mechanisms and shared external causes so the correlation
  visuals do not imply that paired outcomes cause one another.
- Rejected a marked measuring-tape draft, an inaccurate 10/9/8 percentage
  tower, and a seven-section supposedly fair spinner. Accepted replacements
  contain no readable markings, use exact 12/10/9 groups plus one empty
  position, and remove the invalid spinner entirely.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-data-correlation-myths-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1558/1584`, with `26` pending.
- Next batch runs from `dataStatisticsCriticalConsumerHero` through
  `eatRainbowHero`.

## Lesson visual quality redo - critical consumer and nutrition batch of 10

Completed on 2026-07-13:

- Completed the batch from `dataStatisticsCriticalConsumerHero` through
  `eatRainbowHero`.
- Verified that the critical-consumer pair communicates population/sample,
  source, comparison, chart framing, and missing-context checks without
  readable labels or fake interfaces.
- Checked nutrition accuracy across the set: macro groupings use recognizable
  foods, micronutrients are represented as varied supporting inputs rather
  than pills, and the rainbow visual retains grains, beans, protein, and
  healthy fat so color variety is not presented as a complete diet by itself.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-critical-nutrition-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1568/1584`, with `16` pending.
- Next batch runs from `balancedEatingHero` through
  `cardioStrengthMobility`.

## Lesson visual quality redo - balanced eating, hydration, myths, and exercise batch of 10

Completed on 2026-07-13:

- Completed the batch from `balancedEatingHero` through
  `cardioStrengthMobility`.
- Verified balanced-plate proportions without presenting them as rigid rules,
  and kept drinking water visually distinct from the secondary contribution
  of water-rich foods.
- Rejected the first `mythFilterHero` draft because it moralized one specific
  food. The accepted replacement uses matching neutral food tokens and changes
  only the quality of evidence and presentation hype.
- Exercise visuals distinguish cardio, strength, and mobility as complementary
  modes and frame movement as gradual support rather than a medical cure.
- All 10 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-balanced-hydration-exercise-batch10-accepted.png`.
- Registered all keys; manifest coverage is `1578/1584`, with `6` pending.
- The final partial batch runs from `exerciseStartHero` through
  `catWeatherHero`.

## Lesson visual quality redo - final exercise, physics, and weather batch of 6

Completed on 2026-07-13:

- Completed the final partial batch from `exerciseStartHero` through
  `catWeatherHero`.
- Exercise-start visuals show gradual progression, preparation, warmup, sound
  form, and rest without fixed schedules, streak pressure, or cure claims.
- The physics category hero keeps motion/force, a mechanical wave, particle
  heat, and orbital gravity in separate coherent apparatus sections. The
  weather hero shows vapor rising, cloud formation, rain returning to water,
  atmospheric circulation, and a broader climate ring.
- All 6 accepted files are `1672x941`; reviewed contact sheet:
  `image-pipeline/qa-final-exercise-physics-weather-batch6-accepted.png`.
- Registered all keys. The lesson visual manifest is complete at
  `1584/1584`, with `0` pending.
- Confirmed that every regenerated, non-exempt asset uses `1672x941`. The 119
  native-size exceptions are exclusively the Money & Finance and Mindfulness
  pilot assets that the quality tracker explicitly says to keep unchanged.
- No loose image-generation work remains for this manifest.
