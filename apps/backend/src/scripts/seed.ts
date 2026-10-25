import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import StoryModule from "../modules/story"

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER) as any
  const link = container.resolve(ContainerRegistrationKeys.LINK) as any

  const storeModule = container.resolve(Modules.STORE) as any
  const regionModule = container.resolve(Modules.REGION) as any
  const productModule = container.resolve(Modules.PRODUCT) as any
  const pricingModule = container.resolve(Modules.PRICING) as any
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION) as any
  const inventoryModule = container.resolve(Modules.INVENTORY) as any
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL) as any
  const customerModule = container.resolve(Modules.CUSTOMER) as any

  // Custom publishing modules
  let storyModule: any = null
  let subscriptionModule: any = null
  try {
    storyModule = container.resolve("storyModuleService")
  } catch {
    logger.warn("storyModuleService not resolved in container; skipping story seeding.")
  }

  try {
    subscriptionModule = container.resolve("subscriptionModuleService")
  } catch {
    logger.warn("subscriptionModuleService not resolved in container; skipping subscription seeding.")
  }

  logger.info("==========================================================")
  logger.info("STARTING MEDUSA V2 MULTI-FORMAT PUBLISHING SEEDING PIPELINE")
  logger.info("==========================================================")

  // 1. Configure Store & Currencies
  logger.info("1/8. Configuring Store & Currencies (SAR, AED, USD)...")
  const [store] = await storeModule.listStores()
  if (store) {
    await storeModule.updateStores(store.id, {
      name: "منصة النشر والروايات المتكاملة | StoryPublish",
      supported_currencies: [
        { currency_code: "sar", is_default: true },
        { currency_code: "aed" },
        { currency_code: "usd" },
      ],
    })
  }

  // 2. Provision Sales Channel
  logger.info("2/8. Provisioning Primary Sales Channels...")
  let defaultSalesChannel = (
    await salesChannelModule.listSalesChannels({ name: "Default Sales Channel" })
  )[0]
  if (!defaultSalesChannel) {
    defaultSalesChannel = await salesChannelModule.createSalesChannels({
      name: "Default Sales Channel",
      description: "Omnichannel e-commerce web storefront and mobile app",
    })
  }

  // 3. Provision Multi-Warehouse Stock Locations (Riyadh & Dubai Hubs)
  logger.info("3/8. Provisioning Multi-Warehouse Inventory Stock Locations...")
  let riyadhLocation = (
    await stockLocationModule.listStockLocations({ name: "Riyadh Logistics Center" })
  )[0]
  if (!riyadhLocation) {
    riyadhLocation = await stockLocationModule.createStockLocations({
      name: "Riyadh Logistics Center",
      address: {
        address_1: "King Fahd Road, Al-Sahafa District",
        city: "Riyadh",
        country_code: "sa",
        postal_code: "13321",
        phone: "+966114000000",
      },
    })
  }

  let dubaiLocation = (
    await stockLocationModule.listStockLocations({ name: "Dubai Regional Hub" })
  )[0]
  if (!dubaiLocation) {
    dubaiLocation = await stockLocationModule.createStockLocations({
      name: "Dubai Regional Hub",
      address: {
        address_1: "Dubai Logistics City, DWC",
        city: "Dubai",
        country_code: "ae",
        postal_code: "00000",
        phone: "+97148000000",
      },
    })
  }

  // Link sales channel to stock locations
  await link.create([
    {
      [Modules.SALES_CHANNEL]: { sales_channel_id: defaultSalesChannel.id },
      [Modules.STOCK_LOCATION]: { stock_location_id: riyadhLocation.id },
    },
    {
      [Modules.SALES_CHANNEL]: { sales_channel_id: defaultSalesChannel.id },
      [Modules.STOCK_LOCATION]: { stock_location_id: dubaiLocation.id },
    },
  ])

  // 4. Provision Customer Groups (B2C & VIP Readers)
  logger.info("4/8. Creating Customer Segmentation Groups...")
  const existingGroups = await customerModule.listCustomerGroups({
    name: ["B2C Retail Readers", "VIP All-Access Subscribers"],
  })
  const existingGroupNames = new Set(existingGroups.map((g: any) => g.name))
  const groupsToCreate = [
    {
      name: "B2C Retail Readers",
      metadata: { discount_tier: "standard" },
    },
    {
      name: "VIP All-Access Subscribers",
      metadata: { discount_tier: "vip_reader_30" },
    },
  ].filter((g) => !existingGroupNames.has(g.name))

  if (groupsToCreate.length > 0) {
    await customerModule.createCustomerGroups(groupsToCreate)
  }

  // 5. Provision Tax & Regions (Saudi Arabia 15% VAT, UAE 5% VAT)
  logger.info("5/8. Configuring Regions and VAT Tax Framework...")
  let ksaRegion = (await regionModule.listRegions({ name: "Saudi Arabia (KSA)" }))[0]
  if (!ksaRegion) {
    ksaRegion = await regionModule.createRegions({
      name: "Saudi Arabia (KSA)",
      currency_code: "sar",
      countries: ["sa"],
      metadata: { vat_rate: 15 },
    })
  }

  let uaeRegion = (
    await regionModule.listRegions({ name: "United Arab Emirates (UAE)" })
  )[0]
  if (!uaeRegion) {
    uaeRegion = await regionModule.createRegions({
      name: "United Arab Emirates (UAE)",
      currency_code: "aed",
      countries: ["ae"],
      metadata: { vat_rate: 5 },
    })
  }

  // 6. Provision Literary Authors and Voice Narrators in Custom StoryModule
  logger.info("6/8. Seeding Literary Authors & Voice Narrators...")
  let authorMouna: any = null
  let authorOmar: any = null
  let authorGhassan: any = null

  let narratorReem: any = null
  let narratorSami: any = null

  if (storyModule) {
    const existingAuthors = await storyModule.listAuthors()
    if (existingAuthors && existingAuthors.length > 0) {
      authorMouna = existingAuthors.find((a: any) => a.name === "منى السعيد")
      authorOmar = existingAuthors.find((a: any) => a.name === "عمر اليافعي")
      authorGhassan = existingAuthors.find((a: any) => a.name === "د. غسان الكيلاني")
    }
    if (!authorMouna) {
      const authors = await storyModule.createAuthors([
        {
          name: "منى السعيد",
          bio: "كاتبة متخصصة في أدب الطفل والقصص المصورة التربوية، حائزة على جوائز عربية في تعزيز الخيال الإيجابي لدى الناشئة.",
          avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
          royalty_percentage: 12.5,
        },
        {
          name: "عمر اليافعي",
          bio: "روائي متخصص في الخيال العلمي والمغامرات المشوقة للناشئة والشباب، تميزت أعماله بحبكة علمية مبسطة وبناء عوالم مشوق.",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
          royalty_percentage: 15.0,
        },
        {
          name: "د. غسان الكيلاني",
          bio: "مؤرخ وباحث وروائي في التراث الحضاري والأدب التاريخي والغموض، نُشرت له أكثر من عشر روايات حائزة على إشادة نقدية واسعة.",
          avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
          royalty_percentage: 18.0,
        },
      ])
      authorMouna = authors[0]
      authorOmar = authors[1]
      authorGhassan = authors[2]
    }

    const existingNarrators = await storyModule.listNarrators()
    if (existingNarrators && existingNarrators.length > 0) {
      narratorReem = existingNarrators.find((n: any) => n.name === "ريم الجودر")
      narratorSami = existingNarrators.find((n: any) => n.name === "سامي المهدي")
    }
    if (!narratorReem) {
      const narrators = await storyModule.createNarrators([
        {
          name: "ريم الجودر",
          bio: "فنانة صوتية ومسرحية رائدة متخصصة في حكايات الأطفال والأداء الصوتي التفاعلي المسرحي.",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
          sample_voice_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
          name: "سامي المهدي",
          bio: "معلق صوتي إذاعي محترف ذو نبرة درامية عميقة، قدم عشرات الروايات الصوتية والوثائقيات العالمية.",
          avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
          sample_voice_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        },
      ])
      narratorReem = narrators[0]
      narratorSami = narrators[1]
    }
  }

  // 7. Provision Subscription Tiers in SubscriptionModule
  logger.info("7/8. Seeding VIP Subscription Tiers...")
  if (subscriptionModule) {
    const existingTiers = await subscriptionModule.listSubscriptionTiers()
    if (!existingTiers || existingTiers.length === 0) {
      await subscriptionModule.createSubscriptionTiers([
        {
          title: "باقة براعم الأطفال (Kids Story Pass)",
          handle: "tier_kids",
          description: "وصول غير محدود لجميع قصص الأطفال المصورة وبث صوتي مهدئ لما قبل النوم بدون إعلانات.",
          interval: "month",
          price_amount: 2900,
          currency_code: "sar",
          book_credits_per_period: 0,
          is_active: true,
        },
        {
          title: "باقة القارئ والمستمع VIP (شهري)",
          handle: "tier_monthly_vip",
          description: "2 رصيد شهري لاقتناء أي رواية أو كتاب صوتي والاحتفاظ به، مع خصم 30% على النسخ الورقية.",
          interval: "month",
          price_amount: 4900,
          currency_code: "sar",
          book_credits_per_period: 2,
          is_active: true,
        },
        {
          title: "الاشتراك السنوي الشامل All-Access",
          handle: "tier_annual_vip",
          description: "24 رصيد كتاب سنوي فوري، وشحن مجاني لكافة طلبات الكتب الورقية طوال العام.",
          interval: "year",
          price_amount: 49000,
          currency_code: "sar",
          book_credits_per_period: 24,
          is_active: true,
        },
      ])
    }
  }

  // 8. Provision Multi-Format Publishing Products (Paperback, E-Book, Audiobook)
  logger.info("8/8. Provisioning Multi-Format Stories, Metadata & DRM Chapters...")

  const publishingStories = [
    {
      title: "مغامرة الأرنب الصغير سمسم في الغابة السحرية",
      handle: "samsem-the-bunny-adventure",
      description:
        "قصة دافئة ورائعة تأخذ الأطفال الصغار في رحلة مليئة بالألوان والموسيقى مع الأرنب سمسم الذي يبحث عن الجزرة الذهبية الضائعة.",
      thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
      age_group: "kids_3_6",
      isbn: "978-603-04-1234-1",
      page_count: 32,
      audio_duration_seconds: 1440,
      author_id: authorMouna?.id || null,
      narrator_id: narratorReem?.id || null,
      sample_pdf_url: "samples/samsem-ch1.pdf",
      sample_audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      paperbackPrice: 4500,
      ebookPrice: 2000,
      audiobookPrice: 2500,
    },
    {
      title: "أين اختفت نجمتي الساطعة؟",
      handle: "where-did-my-shiny-star-go",
      description:
        "قصة ما قبل النوم الساحرة والمهدئة. في ليلة هادئة، تبحث الطفلة ليان عن نجمتها الفضية التي اعتادت أن تضيء غرفتها كل مساء.",
      thumbnail: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=800&q=80",
      age_group: "kids_3_6",
      isbn: "978-603-04-1234-2",
      page_count: 28,
      audio_duration_seconds: 1080,
      author_id: authorMouna?.id || null,
      narrator_id: narratorReem?.id || null,
      sample_pdf_url: "samples/star-ch1.pdf",
      sample_audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      paperbackPrice: 3800,
      ebookPrice: 1500,
      audiobookPrice: 2000,
    },
    {
      title: "سفينة الفضاء السرية وسر كوكب الزمرد",
      handle: "secret-spaceship-emerald-planet",
      description:
        "مغامرة خيال علمي شيقة للناشئة، تبدأ عندما يكتشف ثلاثة أصدقاء سفينة استكشاف مجهولة مخبأة في قبو مرصد فلكي قديم.",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      age_group: "kids_7_12",
      isbn: "978-603-04-1234-3",
      page_count: 144,
      audio_duration_seconds: 11700,
      author_id: authorOmar?.id || null,
      narrator_id: narratorSami?.id || null,
      sample_pdf_url: "samples/space-ch1.pdf",
      sample_audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      paperbackPrice: 5500,
      ebookPrice: 2500,
      audiobookPrice: 3000,
    },
    {
      title: "شفرة قصر الحمراء: لغز المخطوطة الأندلسية",
      handle: "alhambra-code-andalusian-manuscript",
      description:
        "رواية غموض وتاريخ تحبس الأنفاس تدور حول باحث شاب في الآثار يكتشف رسالة مخفية داخل نقوش الفسيفساء بقصر الحمراء.",
      thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
      age_group: "teens_13_17",
      isbn: "978-603-04-1234-5",
      page_count: 312,
      audio_duration_seconds: 26400,
      author_id: authorGhassan?.id || null,
      narrator_id: narratorSami?.id || null,
      sample_pdf_url: "samples/alhambra-ch1.pdf",
      sample_audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      paperbackPrice: 7500,
      ebookPrice: 3500,
      audiobookPrice: 4500,
    },
    {
      title: "أطياف بغداد القديمة: ملحمة أسرار الرافدين",
      handle: "spectres-of-ancient-baghdad",
      description:
        "ملحمة روائية عميقة تسبر أغوار العصر الذهبي لبيت الحكمة في بغداد، وتتبع مصائر علماء وفلاسفة واجهوا صراعات السلطة.",
      thumbnail: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80",
      age_group: "adults_18_plus",
      isbn: "978-603-04-1234-6",
      page_count: 448,
      audio_duration_seconds: 42000,
      author_id: authorGhassan?.id || null,
      narrator_id: narratorSami?.id || null,
      sample_pdf_url: "samples/baghdad-ch1.pdf",
      sample_audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      paperbackPrice: 8500,
      ebookPrice: 4000,
      audiobookPrice: 5000,
    },
  ]

  for (const story of publishingStories) {
    const existingProducts = await productModule.listProducts({ handle: story.handle })
    if (existingProducts && existingProducts.length > 0) {
      logger.info(`Product "${story.title}" already exists, skipping.`)
      continue
    }
    // 1. Create Product with 3 Multi-Format Variants: Paperback, E-Book, Audiobook
    const [product] = await productModule.createProducts([
      {
        title: story.title,
        handle: story.handle,
        description: story.description,
        thumbnail: story.thumbnail,
        status: "published",
        variants: [
          {
            title: "غلاف ورقي فاخر (Paperback)",
            sku: `${story.handle.toUpperCase()}-PAPERBACK`,
            manage_inventory: true,
          },
          {
            title: "كتاب إلكتروني (E-Book EPUB/PDF)",
            sku: `${story.handle.toUpperCase()}-EBOOK`,
            manage_inventory: false,
          },
          {
            title: "كتاب صوتي كامل (Audiobook MP3/HLS)",
            sku: `${story.handle.toUpperCase()}-AUDIOBOOK`,
            manage_inventory: false,
          },
        ],
      },
    ])

    const paperbackVar = product.variants[0]
    const ebookVar = product.variants[1]
    const audioVar = product.variants[2]

    // 2. Link Product to Sales Channel
    await link.create({
      [Modules.PRODUCT]: { product_id: product.id },
      [Modules.SALES_CHANNEL]: { sales_channel_id: defaultSalesChannel.id },
    })

    // 3. Price Sets for each format variant
    const [paperbackPriceSet] = await pricingModule.createPriceSets([
      {
        prices: [{ currency_code: "sar", amount: story.paperbackPrice }],
      },
    ])
    const [ebookPriceSet] = await pricingModule.createPriceSets([
      {
        prices: [{ currency_code: "sar", amount: story.ebookPrice }],
      },
    ])
    const [audioPriceSet] = await pricingModule.createPriceSets([
      {
        prices: [{ currency_code: "sar", amount: story.audiobookPrice }],
      },
    ])

    await link.create([
      {
        [Modules.PRODUCT]: { variant_id: paperbackVar.id },
        [Modules.PRICING]: { price_set_id: paperbackPriceSet.id },
      },
      {
        [Modules.PRODUCT]: { variant_id: ebookVar.id },
        [Modules.PRICING]: { price_set_id: ebookPriceSet.id },
      },
      {
        [Modules.PRODUCT]: { variant_id: audioVar.id },
        [Modules.PRICING]: { price_set_id: audioPriceSet.id },
      },
    ])

    // 4. Physical Inventory for Paperback only
    const [invItem] = await inventoryModule.createInventoryItems([
      {
        sku: `${story.handle.toUpperCase()}-PAPERBACK`,
        description: `${story.title} - نسخة ورقية فاخرة`,
      },
    ])

    await link.create({
      [Modules.PRODUCT]: { variant_id: paperbackVar.id },
      [Modules.INVENTORY]: { inventory_item_id: invItem.id },
    })

    await inventoryModule.createInventoryLevels([
      {
        inventory_item_id: invItem.id,
        location_id: riyadhLocation.id,
        stocked_quantity: 120,
      },
      {
        inventory_item_id: invItem.id,
        location_id: dubaiLocation.id,
        stocked_quantity: 60,
      },
    ])

    // 5. Create StoryMetadata and DigitalMedia Chapters
    if (storyModule) {
      const [meta] = await (storyModule.createStoryMetadata || storyModule.createStoryMetadatas).call(storyModule, [
        {
          age_group: story.age_group,
          isbn: story.isbn,
          language: "ar",
          page_count: story.page_count,
          audio_duration_seconds: story.audio_duration_seconds,
          publication_date: new Date(),
          sample_chapter_pdf_url: story.sample_pdf_url,
          sample_audio_url: story.sample_audio_url,
          author_id: story.author_id,
          narrator_id: story.narrator_id,
        },
      ])

      // Link Product to StoryMetadata
      await link.create({
        [Modules.PRODUCT]: { product_id: product.id },
        storyModuleService: { story_metadata_id: meta.id },
      })

      // Create DigitalMedia for E-Book
      const [ebookMedia] = await storyModule.createDigitalMedias([
        {
          story_metadata_id: meta.id,
          variant_id: ebookVar.id,
          format: "ebook_epub",
          title: `${story.title} - النسخة الرقمية الكاملة`,
          chapter_number: 1,
          duration_seconds: null,
          private_storage_key: `protected/ebooks/${story.handle}.epub`,
          file_size_bytes: 5242880,
          mime_type: "application/epub+zip",
          is_sample: false,
        },
      ])

      // Create DigitalMedia for Audiobook Chapters
      const audioMediaChapters = await storyModule.createDigitalMedias([
        {
          story_metadata_id: meta.id,
          variant_id: audioVar.id,
          format: "audio_mp3",
          title: "الفصل 1: البداية واللقاء الأول",
          chapter_number: 1,
          duration_seconds: 900,
          private_storage_key: `protected/audiobooks/${story.handle}/chapter-01.mp3`,
          file_size_bytes: 14400000,
          mime_type: "audio/mpeg",
          is_sample: false,
        },
        {
          story_metadata_id: meta.id,
          variant_id: audioVar.id,
          format: "audio_mp3",
          title: "الفصل 2: الرحلة عبر المجهول",
          chapter_number: 2,
          duration_seconds: 1200,
          private_storage_key: `protected/audiobooks/${story.handle}/chapter-02.mp3`,
          file_size_bytes: 19200000,
          mime_type: "audio/mpeg",
          is_sample: false,
        },
      ])

      // Link Variants to DigitalMedia
      await link.create([
        {
          [Modules.PRODUCT]: { product_variant_id: ebookVar.id },
          storyModuleService: { digital_media_id: ebookMedia.id },
        },
        {
          [Modules.PRODUCT]: { product_variant_id: audioVar.id },
          storyModuleService: { digital_media_id: audioMediaChapters[0].id },
        },
        {
          [Modules.PRODUCT]: { product_variant_id: audioVar.id },
          storyModuleService: { digital_media_id: audioMediaChapters[1].id },
        },
      ])
    }

    logger.info(`-> Seeded Multi-Format Story: "${story.title}" [${story.age_group}]`)
  }

  logger.info("==========================================================")
  logger.info("PUBLISHING PLATFORM SEEDING COMPLETED SUCCESSFULLY")
  logger.info("==========================================================")
}
