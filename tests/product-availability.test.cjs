const test = require('node:test'), assert = require('node:assert/strict')
const { loadSource } = require('./source-loader.cjs')
const { preferredVariant } = loadSource('apps/storefront/src/lib/product-availability.ts')
const variant = (id, amount, stock) => ({ id, calculated_price: { calculated_amount: amount }, manage_inventory: true, inventory_quantity: stock })
test('A sold-out first variant cannot disable purchasing another available edition', () => {
  const sold = variant('paper', 5, 0), digital = { ...variant('ebook', 12.5, 0), manage_inventory: false }
  assert.equal(preferredVariant([sold, digital]).id, 'ebook')
  assert.equal(preferredVariant([digital, sold]).id, 'ebook')
})
test('Default edition selection rejects missing and invalid prices and keeps genuine zero prices', () => {
  const invalid = [variant('negative', -1, 4), variant('nan', NaN, 4), { id: 'missing' }]
  assert.equal(preferredVariant(invalid), undefined)
  assert.equal(preferredVariant([...invalid, variant('free', 0, 1), variant('paid', 1, 1)]).id, 'free')
})
