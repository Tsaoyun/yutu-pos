# Master Data Guide

This guide defines how YUTU POS should think about master data and transaction data.

## Definitions

### Master Data

Master data describes things the shop sells or uses repeatedly.

Current / near-term master data:

- products
- categories
- seats
- customer source enum
- business event type enum
- usage type enum

Master data can change over time, but it should not rewrite historical transaction facts.

### Transaction Data

Transaction data records what happened.

Examples:

- orders
- order items
- business events
- inventory movements

Transaction records should snapshot the needed master data at the time of the event.

### Snapshot Data

Snapshot data records a point-in-time summary.

Examples:

- dailyClosings
- daily report export
- daily archive export

Snapshots help audit and review, but they should not replace source records.

### Derived Data

Derived data is calculated from source records.

Examples:

- analytics summaries
- product rankings
- category summaries
- temperature summary
- dailySummary

Derived data can be recalculated.

## Product Master Data Rules

- Product current price affects new orders only.
- Product current cost affects new orders and Business Event product-source defaults only.
- Product rename should not rewrite historical order item names.
- Product category change should not rewrite historical order item categories.
- Product ordering rules should be metadata-driven.
- Product data should not include recipe, inventory deduction, or ERP fields in Sprint 2.

## Order Item Snapshot Rules

Order item should preserve enough information to understand the sale later:

- product id
- product name at order time
- category at order time
- type at order time
- selected temperature
- selected service mode
- selected variant
- unit price
- unit cost
- option / ice extra price
- quantity

Analytics should primarily use these snapshots, not current Product fields.

## Category Rules

Category is menu grouping and reporting grouping.

Recommended direction:

- Category has stable `id`.
- Product stores `categoryId`.
- Category can provide defaults for product metadata.
- Product explicit metadata overrides category defaults.
- POS ordering should not use category string checks directly.

## Product ID Rules

- Product id is the durable reference.
- Product display name can change.
- Order item stores product id and product name snapshot.
- Product id should be used for joins or current-product lookup.
- Historical display can use snapshot name unless a product decision says otherwise.

## Backup / Restore Rules

Full backup should include master data and transaction data.

Restore should:

- validate shape.
- normalize old fields.
- preserve transaction snapshots.
- not recalculate historical orders from current master data.

## Daily Closing Rules

DailyClosing is a snapshot.

It should not become a master data source and should not lock POS ordering.

## Analytics Rules

Analytics is derived data.

Analytics may join product id to current master data for display enrichment, but historical totals should come from order item snapshots.

## Anti-Patterns

Avoid:

- using product name to drive behavior.
- using category display name to drive behavior.
- recalculating old order prices from current product price.
- changing historical orders when Product Editor changes.
- adding recipe/material deduction fields to Product before inventory design is ready.

