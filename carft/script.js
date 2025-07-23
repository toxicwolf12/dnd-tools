document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  const lucide = window.lucide // Declare the lucide variable
  lucide.createIcons()

  // Game state
  let inventory = []
  let dissectables = []
  let tools = []
  let craftingSlots = []
  let selectedTool = null
  let selectedDissectable = null
  let craftedItems = []
  let craftingHistory = []
  let dissectionHistory = []
  let lastSaved = ""
  let saveStatus = "saved"
  let isDMAuthenticated = false

  // Icon map
  const iconMap = {
    Mountain: "mountain",
    Shield: "shield",
    Gem: "gem",
    Flame: "flame",
    Star: "star",
    Leaf: "leaf",
    Eye: "eye",
    Wind: "wind",
    Heart: "heart",
    Skull: "skull",
    TreePine: "tree-pine",
    Pickaxe: "pickaxe",
    Knife: "pocket-knife",
    Sword: "sword",
    Droplets: "droplets",
    Scroll: "scroll",
  }

  // Rarity values
  const rarityValues = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
  }

  // Item types
  const itemTypes = {
    weapon: { icon: "sword", names: ["Sword", "Blade", "Axe", "Hammer", "Dagger", "Staff", "Bow"] },
    armor: { icon: "shield", names: ["Armor", "Shield", "Helmet", "Gauntlets", "Boots", "Cloak"] },
    potion: { icon: "droplets", names: ["Potion", "Elixir", "Brew", "Tonic", "Draught"] },
    scroll: { icon: "scroll", names: ["Scroll", "Tome", "Grimoire", "Codex", "Manual"] },
    accessory: { icon: "gem", names: ["Ring", "Amulet", "Pendant", "Bracelet", "Crown", "Orb"] },
  }

  // Default materials
  const materials = [

  ]

  // Default dissectable items
  const dissectableItems = [
    {
      id: "d1",
      name: "Goblin Corpse",
      type: "creature",
      rarity: "common",
      icon: "skull",
      description: "Remains of a defeated goblin",
      properties: ["creature", "small", "bone", "flesh"],
    },
    {
      id: "d2",
      name: "Dragon Carcass",
      type: "creature",
      rarity: "legendary",
      icon: "skull",
      description: "Massive dragon remains",
      properties: ["dragon", "large", "scales", "fire", "bone", "legendary"],
    },
    {
      id: "d3",
      name: "Ancient Tree",
      type: "plant",
      rarity: "rare",
      icon: "tree-pine",
      description: "A mystical ancient tree",
      properties: ["plant", "ancient", "wood", "magic", "bark"],
    },
    {
      id: "d4",
      name: "Crystal Geode",
      type: "mineral",
      rarity: "uncommon",
      icon: "gem",
      description: "Rock formation with crystals inside",
      properties: ["mineral", "crystal", "earth", "magic"],
    },
    {
      id: "d5",
      name: "Shadow Beast",
      type: "creature",
      rarity: "epic",
      icon: "eye",
      description: "Ethereal creature of darkness",
      properties: ["creature", "shadow", "dark", "essence", "magic"],
    },
    {
      id: "d6",
      name: "Phoenix Nest",
      type: "creature",
      rarity: "epic",
      icon: "flame",
      description: "Abandoned phoenix nesting site",
      properties: ["fire", "feathers", "ash", "rebirth", "nest"],
    },
    {
      id: "d7",
      name: "Moonflower",
      type: "plant",
      rarity: "uncommon",
      icon: "star",
      description: "Flower that blooms under moonlight",
      properties: ["plant", "moon", "light", "petals", "magic"],
    },
    {
      id: "d8",
      name: "Iron Vein",
      type: "mineral",
      rarity: "common",
      icon: "mountain",
      description: "Rich iron ore deposit",
      properties: ["mineral", "metal", "ore", "sturdy"],
    },
  ]

  // Default dissection tools
  const dissectionTools = [
    {
      id: "t1",
      name: "Rusty Knife",
      type: "tool",
      rarity: "common",
      icon: "pocket-knife",
      description: "Basic dissection tool",
      properties: ["tool", "cutting", "basic"],
    },
    {
      id: "t2",
      name: "Enchanted Scalpel",
      type: "tool",
      rarity: "rare",
      icon: "scissors",
      description: "Magical precision cutting tool",
      properties: ["tool", "cutting", "magic", "precision"],
    },
    {
      id: "t3",
      name: "Miner's Pickaxe",
      type: "tool",
      rarity: "uncommon",
      icon: "pickaxe",
      description: "For breaking down minerals",
      properties: ["tool", "mining", "sturdy", "mineral"],
    },
  ]

  // Default game state
  const defaultGameState = {
    inventory: materials.map((material, index) => {
      const quantities = [5, 1, 3, 1, 4, 2, 1, 2, 3]
      return { ...material, quantity: quantities[index] }
    }),
    dissectables: dissectableItems.map((item, index) => {
      const quantities = [2, 1, 1, 3, 1, 1, 2, 4]
      return { ...item, quantity: quantities[index] }
    }),
    tools: dissectionTools.map((tool) => ({ ...tool, quantity: 1 })),
    craftedItems: [],
    craftingHistory: [],
    dissectionHistory: [],
    lastSaved: new Date().toISOString(),
  }

  // Initialize icon select in DM panel
  function initializeIconSelect() {
    const iconSelect = document.getElementById("new-item-icon")
    iconSelect.innerHTML = ""

    Object.keys(iconMap).forEach((iconName) => {
      const option = document.createElement("option")
      option.value = iconName
      option.textContent = iconName
      iconSelect.appendChild(option)
    })
  }

  // Initialize tabs
  function initializeTabs() {
    // Main tabs
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab")

        // Deactivate all tabs
        document.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"))
        document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

        // Activate selected tab
        button.classList.add("active")
        document.getElementById(`${tabId}-tab`).classList.add("active")
      })
    })

    // DM tabs
    document.querySelectorAll(".dm-tab-button").forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab")

        // Deactivate all tabs
        document.querySelectorAll(".dm-tab-button").forEach((btn) => btn.classList.remove("active"))
        document.querySelectorAll(".dm-tab-content").forEach((content) => content.classList.remove("active"))

        // Activate selected tab
        button.classList.add("active")
        document.getElementById(`${tabId}-tab`).classList.add("active")
      })
    })
  }

  // Save game state to localStorage
  function saveGameState() {
    try {
      const gameState = {
        inventory,
        dissectables,
        tools,
        craftedItems,
        craftingHistory,
        dissectionHistory,
        lastSaved: new Date().toISOString(),
      }

      localStorage.setItem("dnd-craft-game", JSON.stringify(gameState))
      lastSaved = gameState.lastSaved
      updateSaveStatus("saved")
    } catch (error) {
      console.error("Save failed:", error)
      updateSaveStatus("error")
    }
  }

  // Load game state from localStorage
  function loadGameState() {
    try {
      const saved = localStorage.getItem("dnd-craft-game")
      if (saved) {
        const gameState = JSON.parse(saved)

        inventory = gameState.inventory || []
        dissectables = gameState.dissectables || []
        tools = gameState.tools || []
        craftedItems = gameState.craftedItems || []
        craftingHistory = gameState.craftingHistory || []
        dissectionHistory = gameState.dissectionHistory || []
        lastSaved = gameState.lastSaved

        updateSaveStatus("saved")
        showAiSuggestion(`🎮 Játék automatikusan betöltve! Utolsó mentés: ${new Date(lastSaved).toLocaleString()}`)
      } else {
        resetToDefault()
      }
    } catch (error) {
      console.error("Load failed:", error)
      updateSaveStatus("error")
      resetToDefault()
    }

    // Update UI
    renderInventory()
    renderDissectables()
    renderTools()
    renderCraftedItems()
    renderCraftingHistory()
    renderDissectionHistory()
    updateCounts()
  }

  // Reset to default game state
  function resetToDefault() {
    inventory = [...defaultGameState.inventory]
    dissectables = [...defaultGameState.dissectables]
    tools = [...defaultGameState.tools]
    craftedItems = []
    craftingHistory = []
    dissectionHistory = []
    lastSaved = new Date().toISOString()
    updateSaveStatus("unsaved")
  }

  // Update save status
  function updateSaveStatus(status) {
    saveStatus = status
    const statusIcon = document.getElementById("save-status-icon")
    const statusText = document.getElementById("save-status-text")

    statusIcon.innerHTML = ""

    switch (status) {
      case "saved":
        statusIcon.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4 text-green-400"></i>'
        statusText.textContent = `Auto-mentve: ${new Date(lastSaved).toLocaleTimeString()}`
        break
      case "saving":
        statusIcon.innerHTML = '<i data-lucide="save" class="w-4 h-4 text-yellow-400 animate-spin"></i>'
        statusText.textContent = "Mentés..."
        break
      case "unsaved":
        statusIcon.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 text-orange-400"></i>'
        statusText.textContent = "Változások mentésre várnak"
        break
      case "error":
        statusIcon.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 text-red-400"></i>'
        statusText.textContent = "Mentési hiba"
        break
    }

    lucide.createIcons()
  }

  // Show AI suggestion
  function showAiSuggestion(message) {
    const suggestionContainer = document.getElementById("ai-suggestion")
    const suggestionText = document.getElementById("ai-suggestion-text")

    suggestionText.textContent = message
    suggestionContainer.classList.remove("hidden")
  }

  // Get AI suggestion
  function getAiSuggestion() {
    if (craftingSlots.length === 0) {
      const suggestions = [
        "💡 Próbálj különböző tulajdonságú anyagokat kombinálni!",
        "🔥 Tűz + Fém = Erős fegyverek",
        "🛡️ Védelem + Ritka anyagok = Jobb páncélok",
        "💊 Gyógyító + Természet = Erős potionok",
        "✨ Mágikus anyagok = Különleges tárgyak",
        "🌙 Holdkő + Mágikus kristály = Érdekes kombinációk",
        "🔪 Boncolj szét tárgyakat új anyagokért!",
        isDMAuthenticated ? "🔓 DM mód aktív - hozzáadhatsz új itemeket!" : "🔒 DM mód: jelszó szükséges",
      ]
      showAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
      return
    }

    const properties = craftingSlots.flatMap((slot) => slot.properties)
    const uniqueProps = [...new Set(properties)]

    let suggestion = "🤔 Érdekes kombináció! "

    if (uniqueProps.includes("fire") && uniqueProps.includes("metal")) {
      suggestion += "A tűz és fém kombinációja erős fegyvert eredményezhet!"
    } else if (uniqueProps.includes("healing") && uniqueProps.includes("magic")) {
      suggestion += "Gyógyító mágikus potion készülhet ebből!"
    } else if (uniqueProps.includes("dragon") && uniqueProps.includes("protection")) {
      suggestion += "Sárkány anyagok + védelem = Legendás páncél!"
    } else if (uniqueProps.includes("shadow") && uniqueProps.includes("magic")) {
      suggestion += "Árnyék mágia... valami titokzatos készülhet!"
    } else if (uniqueProps.includes("bone") && uniqueProps.includes("death")) {
      suggestion += "Csont anyagok... sötét mágia vagy nekromancia tárgyak!"
    } else {
      suggestion += `A ${uniqueProps.slice(0, 2).join(" és ")} tulajdonságok érdekes eredményt adhatnak!`
    }

    showAiSuggestion(suggestion)
  }

  // Render inventory
  function renderInventory() {
    const container = document.getElementById("inventory-container")
    container.innerHTML = ""

    inventory.forEach((item) => {
      const itemElement = document.createElement("div")
      itemElement.className =
        "material-items"
      itemElement.innerHTML = `
        <div class="flex items-center gap-2">
          <i data-lucide="${item.icon}" class="w-4 h-4 text-gray-300"></i>
          <div>
            <div class="font-medium text-xs">${item.name}</div>
            <span class="badge rarity-${item.rarity} text-xs">${item.rarity}</span>
            <div class="text-xs text-gray-400">${item.properties.slice(0, 2).join(", ")}</div>
          </div>
        </div>
        <span class="badge badge-secondary text-xs">${item.quantity}</span>
      `

      itemElement.addEventListener("click", () => addToCrafting(item))
      container.appendChild(itemElement)
    })

    lucide.createIcons()
  }

  // Render dissectables
  function renderDissectables() {
    const container = document.getElementById("dissectables-container")
    container.innerHTML = ""

    dissectables.forEach((item) => {
      const itemElement = document.createElement("div")
      itemElement.className = `Dissectables-items`
      itemElement.innerHTML = `
        <div class="flex items-center gap-2">
          <i data-lucide="${item.icon}" class="w-4 h-4"></i>
          <div>
            <div class="font-medium">${item.name}</div>
            <span class="badge rarity-${item.rarity} text-xs">${item.rarity}</span>
          </div>
        </div>
        <span class="badge badge-secondary text-xs">${item.quantity}</span>
      `

      itemElement.addEventListener("click", () => {
        selectedDissectable = item
        renderDissectables()
        updateDissectButton()
      })

      container.appendChild(itemElement)
    })

    lucide.createIcons()
  }

  // Render tools
  function renderTools() {
    const container = document.getElementById("tools-container")
    container.innerHTML = ""

    tools.forEach((tool) => {
      const toolElement = document.createElement("button")
      toolElement.className = `text-xs h-6 px-2 py-1 rounded-md flex items-center ${selectedTool && selectedTool.id === tool.id ? "bg-blue-600 text-black" : "border border-slate-600 text-gray-300 hover:bg-slate-700"}`
      toolElement.innerHTML = `
        <i data-lucide="${tool.icon}" class="w-3 h-3 mr-1"></i>
        ${tool.name}
      `

      toolElement.addEventListener("click", () => {
        selectedTool = tool
        renderTools()
        updateDissectButton()
      })

      container.appendChild(toolElement)
    })

    lucide.createIcons()
  }

  // Render crafting slots
  function renderCraftingSlots() {
    const emptyContainer = document.getElementById("crafting-empty")
    const itemsContainer = document.getElementById("crafting-items")

    if (craftingSlots.length === 0) {
      emptyContainer.classList.remove("hidden")
      itemsContainer.classList.add("hidden")
    } else {
      emptyContainer.classList.add("hidden")
      itemsContainer.classList.remove("hidden")

      itemsContainer.innerHTML = ""

      craftingSlots.forEach((item) => {
        const slotElement = document.createElement("div")
        slotElement.className = "craft-items"
        slotElement.innerHTML = `
          <div class="flex items-center gap-1">
            <i data-lucide="${item.icon}" class="w-3 h-3"></i>
            <span>${item.name}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="badge badge-secondary text-xs h-4">${item.quantity}</span>
            <button class="h-4 w-4 p-0 hover:bg-red-600 rounded-sm">
              <i data-lucide="trash-2" class="w-2 h-2"></i>
            </button>
          </div>
        `

        const removeButton = slotElement.querySelector("button")
        removeButton.addEventListener("click", () => removeFromCrafting(item))

        itemsContainer.appendChild(slotElement)
      })

      lucide.createIcons()
    }

    updateCraftButton()
  }

  // Render crafted items
  function renderCraftedItems() {
    const container = document.getElementById("crafted-container")
    const emptyContainer = document.getElementById("crafted-empty")

    if (craftedItems.length === 0) {
      emptyContainer.classList.remove("hidden")
    } else {
      emptyContainer.classList.add("hidden")
      container.innerHTML = ""

      craftedItems.forEach((item, idx) => {
        const itemElement = document.createElement("div")
        itemElement.className =
          "crafted-items"
        itemElement.innerHTML = `
          <div class="flex items-center gap-2 mb-1">
            <i data-lucide="${item.icon}" class="w-4 h-4 text-yellow-400"></i>
            <div class="flex-1">
              <div class="font-medium text-xs">${item.name}</div>
              <span class="badge rarity-${item.rarity} text-xs">${item.rarity}</span>
            </div>
          </div>
          <div class="text-xs text-gray-300 mb-1">${item.description}</div>
          <div class="text-xs text-blue-300">Properties: ${item.properties.join(", ")}</div>
        `

        container.appendChild(itemElement)
      })

      lucide.createIcons()
    }
  }

  // Render crafting history
  function renderCraftingHistory() {
    const container = document.getElementById("craft-history-container")
    const emptyContainer = document.getElementById("craft-history-empty")

    if (craftingHistory.length === 0) {
      emptyContainer.classList.remove("hidden")
    } else {
      emptyContainer.classList.add("hidden")
      container.innerHTML = ""

      craftingHistory.forEach((entry, idx) => {
        const entryElement = document.createElement("div")
        entryElement.className = "p-2 bg-slate-700/30 rounded text-xs text-gray-300 mb-1"
        entryElement.textContent = entry

        container.appendChild(entryElement)
      })
    }
  }

  // Render dissection history
  function renderDissectionHistory() {
    const container = document.getElementById("dissect-history-container")
    const emptyContainer = document.getElementById("dissect-history-empty")

    if (dissectionHistory.length === 0) {
      emptyContainer.classList.remove("hidden")
    } else {
      emptyContainer.classList.add("hidden")
      container.innerHTML = ""

      dissectionHistory.forEach((entry, idx) => {
        const entryElement = document.createElement("div")
        entryElement.className = "p-2 bg-slate-700/30  rounded text-xs text-gray-300 mb-1"
        entryElement.textContent = entry

        container.appendChild(entryElement)
      })
    }
  }

  // Update counts
  function updateCounts() {
    document.getElementById("inventory-count").textContent = inventory.reduce((sum, item) => sum + item.quantity, 0)
    document.getElementById("dissectables-count").textContent = dissectables.reduce(
      (sum, item) => sum + item.quantity,
      0,
    )
    document.getElementById("crafted-count").textContent = craftedItems.length
  }

  // Update craft button
  function updateCraftButton() {
    const craftButton = document.getElementById("craft-button")

    if (craftingSlots.length === 0) {
      craftButton.disabled = true
      craftButton.classList.add("opacity-50", "cursor-not-allowed")
    } else {
      craftButton.disabled = false
      craftButton.classList.remove("opacity-50", "cursor-not-allowed")
    }
  }

  // Update dissect button
  function updateDissectButton() {
    const dissectButton = document.getElementById("dissect-button")

    if (!selectedTool || !selectedDissectable) {
      dissectButton.disabled = true
      dissectButton.classList.add("opacity-50", "cursor-not-allowed")
    } else {
      dissectButton.disabled = false
      dissectButton.classList.remove("opacity-50", "cursor-not-allowed")
    }
  }

  // Add to crafting
  function addToCrafting(item) {
    if (item.quantity > 0) {
      const existingSlot = craftingSlots.find((slot) => slot.id === item.id)

      if (existingSlot) {
        existingSlot.quantity += 1
      } else {
        craftingSlots.push({ ...item, quantity: 1 })
      }

      // Update inventory
      const inventoryItem = inventory.find((invItem) => invItem.id === item.id)
      inventoryItem.quantity -= 1

      if (inventoryItem.quantity <= 0) {
        inventory = inventory.filter((invItem) => invItem.id !== item.id)
      }

      renderInventory()
      renderCraftingSlots()
      updateCounts()
      updateSaveStatus("unsaved")
    }
  }

  // Remove from crafting
  function removeFromCrafting(item) {
    const slotIndex = craftingSlots.findIndex((slot) => slot.id === item.id)

    if (slotIndex !== -1) {
      const slot = craftingSlots[slotIndex]
      slot.quantity -= 1

      if (slot.quantity <= 0) {
        craftingSlots.splice(slotIndex, 1)
      }

      // Return to inventory
      const existingInv = inventory.find((invItem) => invItem.id === item.id)

      if (existingInv) {
        existingInv.quantity += 1
      } else {
        inventory.push({ ...item, quantity: 1 })
      }

      renderInventory()
      renderCraftingSlots()
      updateCounts()
      updateSaveStatus("unsaved")
    }
  }

  // Generate crafted item
  function generateCraftedItem(materials) {
    if (materials.length === 0) return null

    const allProperties = materials.flatMap((mat) => mat.properties)
    const uniqueProperties = [...new Set(allProperties)]

    const totalRarityValue = materials.reduce((sum, mat) => sum + rarityValues[mat.rarity] * mat.quantity, 0)
    const totalQuantity = materials.reduce((sum, mat) => sum + mat.quantity, 0)
    const avgRarity = Math.round(totalRarityValue / totalQuantity)

    let resultRarity = "common"
    if (avgRarity >= 5) resultRarity = "legendary"
    else if (avgRarity >= 4) resultRarity = "epic"
    else if (avgRarity >= 3) resultRarity = "rare"
    else if (avgRarity >= 2) resultRarity = "uncommon"

    const luck = Math.random()
    if (luck > 0.9 && resultRarity !== "legendary") {
      const rarities = ["common", "uncommon", "rare", "epic", "legendary"]
      const currentIndex = rarities.indexOf(resultRarity)
      if (currentIndex < rarities.length - 1) {
        resultRarity = rarities[currentIndex + 1]
      }
    }

    let itemType = "accessory"

    if (
      uniqueProperties.includes("metal") ||
      uniqueProperties.includes("fire") ||
      uniqueProperties.includes("dragon")
    ) {
      itemType = Math.random() > 0.5 ? "weapon" : "armor"
    } else if (
      uniqueProperties.includes("healing") ||
      uniqueProperties.includes("life") ||
      uniqueProperties.includes("herb")
    ) {
      itemType = "potion"
    } else if (
      uniqueProperties.includes("magic") ||
      uniqueProperties.includes("ancient") ||
      uniqueProperties.includes("shadow")
    ) {
      itemType = Math.random() > 0.5 ? "scroll" : "accessory"
    } else if (uniqueProperties.includes("protection") || uniqueProperties.includes("sturdy")) {
      itemType = "armor"
    }

    const typeInfo = itemTypes[itemType]
    const baseName = typeInfo.names[Math.floor(Math.random() * typeInfo.names.length)]

    const prefixes = {
      fire: ["Flaming", "Burning", "Scorching", "Infernal"],
      dragon: ["Draconic", "Wyrm", "Ancient", "Scaled"],
      magic: ["Mystical", "Arcane", "Enchanted", "Ethereal"],
      shadow: ["Shadow", "Dark", "Umbral", "Void"],
      light: ["Radiant", "Luminous", "Blessed", "Divine"],
      nature: ["Living", "Verdant", "Natural", "Wild"],
      wind: ["Swift", "Windy", "Aerial", "Tempest"],
      healing: ["Healing", "Restorative", "Life-giving", "Blessed"],
      bone: ["Bone", "Skeletal", "Death", "Cursed"],
      scales: ["Scaled", "Armored", "Protected", "Draconic"],
    }

    let prefix = ""
    for (const prop of uniqueProperties) {
      if (prefixes[prop]) {
        const options = prefixes[prop]
        prefix = options[Math.floor(Math.random() * options.length)]
        break
      }
    }

    const itemName = prefix ? `${prefix} ${baseName}` : baseName

    const descriptions = [
      `A ${itemName.toLowerCase()} crafted with ${materials.map((m) => m.name).join(", ")}`,
      `This ${baseName.toLowerCase()} radiates power from its ${uniqueProperties.slice(0, 2).join(" and ")} essence`,
      `Forged with ancient techniques, this ${baseName.toLowerCase()} holds mystical properties`,
      `A masterwork ${baseName.toLowerCase()} imbued with the essence of ${uniqueProperties[0]}`,
    ]

    return {
      id: `crafted_${Date.now()}`,
      name: itemName,
      type: itemType,
      rarity: resultRarity,
      icon: typeInfo.icon,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      properties: uniqueProperties.slice(0, 3),
    }
  }

  // Craft item
  function craftItem() {
    if (craftingSlots.length === 0) return

    const craftedItem = generateCraftedItem(craftingSlots)

    if (craftedItem) {
      craftedItems.push(craftedItem)

      const materialNames = craftingSlots.map((slot) => `${slot.name} x${slot.quantity}`).join(", ")
      const historyEntry = `${craftedItem.name} (${craftedItem.rarity}) <- ${materialNames}`
      craftingHistory.unshift(historyEntry)

      if (craftingHistory.length > 10) {
        craftingHistory.pop()
      }

      craftingSlots = []

      showAiSuggestion(
        `🎉 Sikeresen elkészítetted: ${craftedItem.name}! Ez egy ${craftedItem.rarity} ritkaságú ${craftedItem.type}. A kombinált tulajdonságok: ${craftedItem.properties.join(", ")}.`,
      )

      renderCraftingSlots()
      renderCraftedItems()
      renderCraftingHistory()
      updateCounts()
      updateSaveStatus("unsaved")
    } else {
      showAiSuggestion("❌ A crafting nem sikerült. Próbálj más anyagokat!")
    }
  }

  // Generate dissection results
  function generateDissectionResults(dissectable, tool) {
    const results = []
    const toolEfficiency = rarityValues[tool.rarity]
    const sourceRarity = rarityValues[dissectable.rarity]

    const baseCount = Math.max(1, Math.floor((sourceRarity + toolEfficiency) / 2))
    const bonusChance = toolEfficiency * 0.2 + sourceRarity * 0.1

    const materialCount = Math.min(4, Math.max(1, baseCount + (Math.random() > 0.7 ? 1 : 0)))

    for (let i = 0; i < materialCount; i++) {
      const materialProps = [...dissectable.properties]

      let materialName = ""
      let materialIcon = "mountain"
      let materialRarity = "common"
      let newProperties = []

      if (materialProps.includes("bone")) {
        materialName = "Bone Fragment"
        materialIcon = "skull"
        newProperties = ["bone", "sturdy", "death"]
        materialRarity = "common"
      } else if (materialProps.includes("scales")) {
        materialName = "Scale Fragment"
        materialIcon = "shield"
        newProperties = ["scales", "protection", "dragon"]
        materialRarity = Math.random() > 0.5 ? "rare" : "uncommon"
      } else if (materialProps.includes("feathers")) {
        materialName = "Mystical Feather"
        materialIcon = "flame"
        newProperties = ["feathers", "fire", "flight"]
        materialRarity = "epic"
      } else if (materialProps.includes("wood")) {
        materialName = "Enchanted Wood"
        materialIcon = "leaf"
        newProperties = ["wood", "nature", "magic"]
        materialRarity = "uncommon"
      } else if (materialProps.includes("crystal")) {
        materialName = "Crystal Shard"
        materialIcon = "gem"
        newProperties = ["crystal", "magic", "energy"]
        materialRarity = "rare"
      } else if (materialProps.includes("essence")) {
        materialName = "Dark Essence"
        materialIcon = "eye"
        newProperties = ["essence", "shadow", "magic"]
        materialRarity = "epic"
      } else if (materialProps.includes("petals")) {
        materialName = "Moon Petal"
        materialIcon = "star"
        newProperties = ["petals", "moon", "light", "magic"]
        materialRarity = "uncommon"
      } else if (materialProps.includes("ore")) {
        materialName = "Raw Ore"
        materialIcon = "mountain"
        newProperties = ["ore", "metal", "sturdy"]
        materialRarity = "common"
      } else {
        materialName = "Strange Material"
        materialIcon = "gem"
        newProperties = materialProps.slice(0, 2)
        materialRarity = "common"
      }

      if (Math.random() < bonusChance) {
        const rarities = ["common", "uncommon", "rare", "epic", "legendary"]
        const currentIndex = rarities.indexOf(materialRarity)
        if (currentIndex < rarities.length - 1) {
          materialRarity = rarities[currentIndex + 1]
        }
      }

      const quantity = Math.max(1, Math.floor(Math.random() * 3) + 1)

      results.push({
        id: `dissected_${Date.now()}_${i}`,
        name: materialName,
        type: "material",
        rarity: materialRarity,
        icon: materialIcon,
        description: `Material extracted from ${dissectable.name}`,
        properties: newProperties,
        quantity: quantity,
      })
    }

    return results
  }

  // Perform dissection
  function performDissection() {
    if (!selectedDissectable || !selectedTool) {
      showAiSuggestion("❌ Válassz egy boncolandó tárgyat és egy eszközt!")
      return
    }

    const results = generateDissectionResults(selectedDissectable, selectedTool)

    results.forEach((result) => {
      const existingItem = inventory.find((item) => item.name === result.name)

      if (existingItem) {
        existingItem.quantity += result.quantity
      } else {
        inventory.push(result)
      }
    })

    // Remove dissectable
    const dissectableIndex = dissectables.findIndex((item) => item.id === selectedDissectable.id)
    dissectables[dissectableIndex].quantity -= 1

    if (dissectables[dissectableIndex].quantity <= 0) {
      dissectables.splice(dissectableIndex, 1)
    }

    const resultNames = results.map((r) => `${r.name} x${r.quantity}`).join(", ")
    const historyEntry = `${selectedDissectable.name} -> ${resultNames} (${selectedTool.name})`
    dissectionHistory.unshift(historyEntry)

    if (dissectionHistory.length > 10) {
      dissectionHistory.pop()
    }

    showAiSuggestion(
      `🔪 Sikeresen boncolás! ${selectedDissectable.name} -> ${results.length} különböző anyag: ${results.map((r) => r.name).join(", ")}`,
    )

    selectedDissectable = null

    renderInventory()
    renderDissectables()
    renderDissectionHistory()
    updateCounts()
    updateDissectButton()
    updateSaveStatus("unsaved")
  }

  // DM Authentication
  function authenticateDM() {
    const password = document.getElementById("dm-password").value

    if (password === "dm1234") {
      isDMAuthenticated = true
      sessionStorage.setItem("dm-authenticated", "true")
      document.getElementById("dm-password").value = ""

      document.getElementById("dm-auth-form").classList.add("hidden")
      document.getElementById("dm-control-panel").classList.remove("hidden")
      document.getElementById("dm-modal-description").textContent = "Add new items to the game"

      document.getElementById("dm-lock-icon").setAttribute("data-lucide", "unlock")
      lucide.createIcons()

      showAiSuggestion("🔓 DM mód aktiválva! Most hozzáadhatsz új anyagokat.")
    } else {
      showAiSuggestion("❌ Hibás DM jelszó!")
      document.getElementById("dm-password").value = ""
    }
  }

  // DM Logout
  function logoutDM() {
    isDMAuthenticated = false
    sessionStorage.removeItem("dm-authenticated")

    document.getElementById("dm-auth-form").classList.remove("hidden")
    document.getElementById("dm-control-panel").classList.add("hidden")
    document.getElementById("dm-modal-description").textContent = "Enter DM password to access"

    document.getElementById("dm-lock-icon").setAttribute("data-lucide", "lock")
    lucide.createIcons()

    showAiSuggestion("🔒 DM mód deaktiválva.")
  }

  // Add new item
  function addNewItem() {
    const name = document.getElementById("new-item-name").value.trim()

    if (!name) {
      showAiSuggestion("❌ Add meg az item nevét!")
      return
    }

    const type = document.getElementById("new-item-type").value
    const rarity = document.getElementById("new-item-rarity").value
    const iconName = document.getElementById("new-item-icon").value
    const description = document.getElementById("new-item-description").value || `Custom ${type} created by DM`
    const propertiesStr = document.getElementById("new-item-properties").value
    const quantity = Number.parseInt(document.getElementById("new-item-quantity").value) || 1
    const addToInventory = document.getElementById("add-to-inventory").checked

    const properties = propertiesStr
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    const newItem = {
      id: `custom_${Date.now()}`,
      name: name,
      type: type,
      rarity: rarity,
      icon: iconMap[iconName] || "gem",
      description: description,
      properties: properties.length > 0 ? properties : [type, rarity],
      quantity: quantity,
      iconName: iconName,
    }

    if (addToInventory) {
      // Add to inventory (materials)
      const existingItem = inventory.find((item) => item.name === newItem.name)

      if (existingItem) {
        existingItem.quantity += newItem.quantity
      } else {
        inventory.push(newItem)
      }
    } else {
      // Add to dissectables
      const existingItem = dissectables.find((item) => item.name === newItem.name)

      if (existingItem) {
        existingItem.quantity += newItem.quantity
      } else {
        dissectables.push(newItem)
      }
    }

    // Reset form
    document.getElementById("new-item-name").value = ""
    document.getElementById("new-item-description").value = ""
    document.getElementById("new-item-properties").value = ""
    document.getElementById("new-item-quantity").value = "1"
    document.getElementById("dm-modal").classList.add("hidden")

    showAiSuggestion(
      `✅ Új item hozzáadva: ${newItem.name} (${newItem.quantity}x) a ${addToInventory ? "materials" : "dissectables"} listához!`,
    )

    renderInventory()
    renderDissectables()
    updateCounts()
    updateSaveStatus("unsaved")
  }

  // Add corpse
  function addCorpse() {
    const name = document.getElementById("new-corpse-name").value.trim()

    if (!name) {
      showAiSuggestion("❌ Add meg a creature nevét!")
      return
    }

    const rarity = document.getElementById("new-corpse-rarity").value
    const iconName = document.getElementById("new-corpse-icon").value
    const description = document.getElementById("new-corpse-description").value || `Remains of a defeated ${name}`
    const propertiesStr = document.getElementById("new-corpse-properties").value
    const quantity = Number.parseInt(document.getElementById("new-corpse-quantity").value) || 1

    const properties = propertiesStr
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    const corpseItem = {
      id: `corpse_${Date.now()}`,
      name: `${name} Corpse`,
      type: "creature",
      rarity: rarity,
      icon: iconMap[iconName] || "skull",
      description: description,
      properties: properties.length > 0 ? properties : ["creature", "corpse", "bone", "flesh"],
      quantity: quantity,
      iconName: iconName,
    }

    // Add directly to dissectables (NOT materials)
    const existingCorpse = dissectables.find((item) => item.name === corpseItem.name)

    if (existingCorpse) {
      existingCorpse.quantity += corpseItem.quantity
    } else {
      dissectables.push(corpseItem)
    }

    // Reset form
    document.getElementById("new-corpse-name").value = ""
    document.getElementById("new-corpse-description").value = ""
    document.getElementById("new-corpse-properties").value = ""
    document.getElementById("new-corpse-quantity").value = "1"
    document.getElementById("dm-modal").classList.add("hidden")

    showAiSuggestion(`💀 Új corpse hozzáadva: ${corpseItem.name} (${corpseItem.quantity}x) a Dissection Lab-hoz!`)

    renderDissectables()
    updateCounts()
    updateSaveStatus("unsaved")
  }

  // Update corpse preview
  function updateCorpsePreview() {
    const name = document.getElementById("new-corpse-name").value.trim() || "Creature Name"
    const description =
      document.getElementById("new-corpse-description").value || `Remains of a defeated ${name || "creature"}`
    const properties = document.getElementById("new-corpse-properties").value || "creature, corpse"

    document.getElementById("corpse-preview-name").textContent = `${name} Corpse`
    document.getElementById("corpse-preview-desc").textContent = description
    document.getElementById("corpse-preview-props").textContent = `Properties: ${properties}`

    const addButton = document.getElementById("add-corpse-button")

    if (name.trim()) {
      addButton.disabled = false
      addButton.classList.remove("opacity-50", "cursor-not-allowed")
    } else {
      addButton.disabled = true
      addButton.classList.add("opacity-50", "cursor-not-allowed")
    }
  }

  // Auto-save
  function setupAutoSave() {
    setInterval(() => {
      if (saveStatus === "unsaved" && inventory.length > 0) {
        updateSaveStatus("saving")
        setTimeout(saveGameState, 500)
      }
    }, 5000)

    window.addEventListener("beforeunload", () => {
      saveGameState()
    })
  }

  // Initialize
  function initialize() {
    initializeIconSelect()
    initializeTabs()
    loadGameState()
    setupAutoSave()

    // Check DM authentication from session
    const dmAuth = sessionStorage.getItem("dm-authenticated")
    if (dmAuth === "true") {
      isDMAuthenticated = true
      document.getElementById("dm-auth-form").classList.add("hidden")
      document.getElementById("dm-control-panel").classList.remove("hidden")
      document.getElementById("dm-modal-description").textContent = "Add new items to the game"
      document.getElementById("dm-lock-icon").setAttribute("data-lucide", "unlock")
    }

    // Event listeners
    document.getElementById("save-button").addEventListener("click", saveGameState)
    document.getElementById("craft-button").addEventListener("click", craftItem)
    document.getElementById("suggestion-button").addEventListener("click", getAiSuggestion)
    document.getElementById("dissect-button").addEventListener("click", performDissection)

    document.getElementById("dm-panel-button").addEventListener("click", () => {
      document.getElementById("dm-modal").classList.remove("hidden")
    })

    document.getElementById("close-dm-modal").addEventListener("click", () => {
      document.getElementById("dm-modal").classList.add("hidden")
    })

    document.getElementById("dm-auth-button").addEventListener("click", authenticateDM)
    document.getElementById("dm-logout").addEventListener("click", logoutDM)
    document.getElementById("add-item-button").addEventListener("click", addNewItem)
    document.getElementById("add-corpse-button").addEventListener("click", addCorpse)

    document.getElementById("dm-password").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        authenticateDM()
      }
    })

    // Corpse preview update
    document.getElementById("new-corpse-name").addEventListener("input", updateCorpsePreview)
    document.getElementById("new-corpse-description").addEventListener("input", updateCorpsePreview)
    document.getElementById("new-corpse-properties").addEventListener("input", updateCorpsePreview)
    document.getElementById("new-corpse-icon").addEventListener("change", () => {
      const iconValue = document.getElementById("new-corpse-icon").value

      // Auto-set properties based on corpse type
      if (iconValue === "Skull") {
        document.getElementById("new-corpse-properties").value = "creature, bone, flesh, corpse"
      } else if (iconValue === "Flame") {
        document.getElementById("new-corpse-properties").value = "creature, fire, scales, magical"
      } else if (iconValue === "Eye") {
        document.getElementById("new-corpse-properties").value = "creature, shadow, essence, dark"
      } else if (iconValue === "TreePine") {
        document.getElementById("new-corpse-properties").value = "creature, nature, wood, plant"
      }

      updateCorpsePreview()
    })

    // Close modal when clicking outside
    document.getElementById("dm-modal").addEventListener("click", (e) => {
      if (e.target === document.getElementById("dm-modal")) {
        document.getElementById("dm-modal").classList.add("hidden")
      }
    })

    // Initial UI updates
    updateCorpsePreview()
    getAiSuggestion()
  }

  // Start the app
  initialize()
})
