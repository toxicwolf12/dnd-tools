"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sparkles,
  Sword,
  Shield,
  Zap,
  Flame,
  Droplets,
  Leaf,
  Mountain,
  Star,
  Plus,
  Trash2,
  Wand2,
  Crown,
  Gem,
  Scroll,
  Heart,
  Eye,
  Wind,
  Scissors,
  Skull,
  TreePine,
  Pickaxe,
  PocketKnifeIcon as Knife,
  Save,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  UserCog,
} from "lucide-react"

interface Item {
  id: string
  name: string
  type: "material" | "weapon" | "armor" | "potion" | "scroll" | "accessory" | "creature" | "plant" | "mineral" | "tool"
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  icon: any
  description: string
  quantity?: number
  properties: string[]
}

interface GameState {
  inventory: (Item & { quantity: number })[]
  dissectables: (Item & { quantity: number })[]
  tools: (Item & { quantity: number })[]
  craftedItems: Item[]
  craftingHistory: string[]
  dissectionHistory: string[]
  lastSaved: string
}

const iconMap = {
  Mountain,
  Shield,
  Gem,
  Flame,
  Star,
  Leaf,
  Eye,
  Wind,
  Heart,
  Skull,
  TreePine,
  Pickaxe,
  Knife,
  Sword,
  Droplets,
  Scroll,
}

const materials: Item[] = [
  {
    id: "1",
    name: "Iron Ore",
    type: "material",
    rarity: "common",
    icon: Mountain,
    description: "Basic metal ore for crafting",
    properties: ["metal", "sturdy", "common"],
  },
  {
    id: "2",
    name: "Dragon Scale",
    type: "material",
    rarity: "legendary",
    icon: Shield,
    description: "Scales from an ancient dragon",
    properties: ["dragon", "fire", "protection", "legendary"],
  },
  {
    id: "3",
    name: "Mana Crystal",
    type: "material",
    rarity: "rare",
    icon: Gem,
    description: "Crystallized magical energy",
    properties: ["magic", "energy", "crystal", "rare"],
  },
  {
    id: "4",
    name: "Phoenix Feather",
    type: "material",
    rarity: "epic",
    icon: Flame,
    description: "Feather from a mythical phoenix",
    properties: ["fire", "rebirth", "flight", "epic"],
  },
  {
    id: "5",
    name: "Moonstone",
    type: "material",
    rarity: "uncommon",
    icon: Star,
    description: "Stone blessed by moonlight",
    properties: ["moon", "light", "magic", "stone"],
  },
  {
    id: "6",
    name: "Ancient Wood",
    type: "material",
    rarity: "rare",
    icon: Leaf,
    description: "Wood from the oldest trees",
    properties: ["nature", "ancient", "wood", "growth"],
  },
  {
    id: "7",
    name: "Shadow Essence",
    type: "material",
    rarity: "epic",
    icon: Eye,
    description: "Essence extracted from shadows",
    properties: ["shadow", "stealth", "dark", "essence"],
  },
  {
    id: "8",
    name: "Wind Crystal",
    type: "material",
    rarity: "uncommon",
    icon: Wind,
    description: "Crystal infused with wind magic",
    properties: ["wind", "speed", "crystal", "air"],
  },
  {
    id: "9",
    name: "Life Herb",
    type: "material",
    rarity: "common",
    icon: Heart,
    description: "Herb with healing properties",
    properties: ["healing", "nature", "life", "herb"],
  },
]

const dissectableItems: Item[] = [
  {
    id: "d1",
    name: "Goblin Corpse",
    type: "creature",
    rarity: "common",
    icon: Skull,
    description: "Remains of a defeated goblin",
    properties: ["creature", "small", "bone", "flesh"],
  },
  {
    id: "d2",
    name: "Dragon Carcass",
    type: "creature",
    rarity: "legendary",
    icon: Skull,
    description: "Massive dragon remains",
    properties: ["dragon", "large", "scales", "fire", "bone", "legendary"],
  },
  {
    id: "d3",
    name: "Ancient Tree",
    type: "plant",
    rarity: "rare",
    icon: TreePine,
    description: "A mystical ancient tree",
    properties: ["plant", "ancient", "wood", "magic", "bark"],
  },
  {
    id: "d4",
    name: "Crystal Geode",
    type: "mineral",
    rarity: "uncommon",
    icon: Gem,
    description: "Rock formation with crystals inside",
    properties: ["mineral", "crystal", "earth", "magic"],
  },
  {
    id: "d5",
    name: "Shadow Beast",
    type: "creature",
    rarity: "epic",
    icon: Eye,
    description: "Ethereal creature of darkness",
    properties: ["creature", "shadow", "dark", "essence", "magic"],
  },
  {
    id: "d6",
    name: "Phoenix Nest",
    type: "creature",
    rarity: "epic",
    icon: Flame,
    description: "Abandoned phoenix nesting site",
    properties: ["fire", "feathers", "ash", "rebirth", "nest"],
  },
  {
    id: "d7",
    name: "Moonflower",
    type: "plant",
    rarity: "uncommon",
    icon: Star,
    description: "Flower that blooms under moonlight",
    properties: ["plant", "moon", "light", "petals", "magic"],
  },
  {
    id: "d8",
    name: "Iron Vein",
    type: "mineral",
    rarity: "common",
    icon: Mountain,
    description: "Rich iron ore deposit",
    properties: ["mineral", "metal", "ore", "sturdy"],
  },
]

const dissectionTools: Item[] = [
  {
    id: "t1",
    name: "Rusty Knife",
    type: "tool",
    rarity: "common",
    icon: Knife,
    description: "Basic dissection tool",
    properties: ["tool", "cutting", "basic"],
  },
  {
    id: "t2",
    name: "Enchanted Scalpel",
    type: "tool",
    rarity: "rare",
    icon: Scissors,
    description: "Magical precision cutting tool",
    properties: ["tool", "cutting", "magic", "precision"],
  },
  {
    id: "t3",
    name: "Miner's Pickaxe",
    type: "tool",
    rarity: "uncommon",
    icon: Pickaxe,
    description: "For breaking down minerals",
    properties: ["tool", "mining", "sturdy", "mineral"],
  },
]

const rarityColors = {
  common: "bg-gray-500",
  uncommon: "bg-green-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-orange-500",
}

const rarityValues = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
}

const itemTypes = {
  weapon: { icon: Sword, names: ["Sword", "Blade", "Axe", "Hammer", "Dagger", "Staff", "Bow"] },
  armor: { icon: Shield, names: ["Armor", "Shield", "Helmet", "Gauntlets", "Boots", "Cloak"] },
  potion: { icon: Droplets, names: ["Potion", "Elixir", "Brew", "Tonic", "Draught"] },
  scroll: { icon: Scroll, names: ["Scroll", "Tome", "Grimoire", "Codex", "Manual"] },
  accessory: { icon: Gem, names: ["Ring", "Amulet", "Pendant", "Bracelet", "Crown", "Orb"] },
}

const defaultGameState: GameState = {
  inventory: [
    { ...materials[0], quantity: 5 },
    { ...materials[1], quantity: 1 },
    { ...materials[2], quantity: 3 },
    { ...materials[3], quantity: 1 },
    { ...materials[4], quantity: 4 },
    { ...materials[5], quantity: 2 },
    { ...materials[6], quantity: 1 },
    { ...materials[7], quantity: 2 },
    { ...materials[8], quantity: 3 },
  ],
  dissectables: [
    { ...dissectableItems[0], quantity: 2 },
    { ...dissectableItems[1], quantity: 1 },
    { ...dissectableItems[2], quantity: 1 },
    { ...dissectableItems[3], quantity: 3 },
    { ...dissectableItems[4], quantity: 1 },
    { ...dissectableItems[5], quantity: 1 },
    { ...dissectableItems[6], quantity: 2 },
    { ...dissectableItems[7], quantity: 4 },
  ],
  tools: [
    { ...dissectionTools[0], quantity: 1 },
    { ...dissectionTools[1], quantity: 1 },
    { ...dissectionTools[2], quantity: 1 },
  ],
  craftedItems: [],
  craftingHistory: [],
  dissectionHistory: [],
  lastSaved: new Date().toISOString(),
}

export default function Component() {
  const [inventory, setInventory] = useState<(Item & { quantity: number })[]>([])
  const [dissectables, setDissectables] = useState<(Item & { quantity: number })[]>([])
  const [tools, setTools] = useState<(Item & { quantity: number })[]>([])
  const [craftingSlots, setCraftingSlots] = useState<(Item & { quantity: number })[]>([])
  const [selectedTool, setSelectedTool] = useState<Item | null>(null)
  const [selectedDissectable, setSelectedDissectable] = useState<Item | null>(null)
  const [craftedItems, setCraftedItems] = useState<Item[]>([])
  const [aiSuggestion, setAiSuggestion] = useState<string>("")
  const [craftingHistory, setCraftingHistory] = useState<string[]>([])
  const [dissectionHistory, setDissectionHistory] = useState<string[]>([])
  const [lastSaved, setLastSaved] = useState<string>("")
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving" | "error">("saved")

  // DM Panel states
  const [isDMAuthenticated, setIsDMAuthenticated] = useState<boolean>(false)
  const [dmPassword, setDmPassword] = useState<string>("")
  const [dmDialogOpen, setDmDialogOpen] = useState<boolean>(false)
  const [newItemName, setNewItemName] = useState<string>("")
  const [newItemType, setNewItemType] = useState<string>("material")
  const [newItemRarity, setNewItemRarity] = useState<string>("common")
  const [newItemDescription, setNewItemDescription] = useState<string>("")
  const [newItemProperties, setNewItemProperties] = useState<string>("")
  const [newItemQuantity, setNewItemQuantity] = useState<number>(1)
  const [newItemIcon, setNewItemIcon] = useState<string>("Gem")
  const [addToInventory, setAddToInventory] = useState<boolean>(true)

  // Auto-save funkció
  const saveGameState = () => {
    try {
      const gameState: GameState = {
        inventory,
        dissectables,
        tools,
        craftedItems,
        craftingHistory,
        dissectionHistory,
        lastSaved: new Date().toISOString(),
      }

      localStorage.setItem("dnd-craft-game", JSON.stringify(gameState))
      setLastSaved(gameState.lastSaved)
      setSaveStatus("saved")
    } catch (error) {
      console.error("Save failed:", error)
      setSaveStatus("error")
    }
  }

  // Betöltés funkció
  const loadGameState = () => {
    try {
      const saved = localStorage.getItem("dnd-craft-game")
      if (saved) {
        const gameState: GameState = JSON.parse(saved)

        // Restore icon references
        const restoreIcons = (items: any[]) => {
          return items.map((item: any) => {
            const originalItem = [...materials, ...dissectableItems, ...dissectionTools].find(
              (orig) => orig.id === item.id,
            )
            if (originalItem) {
              return { ...item, icon: originalItem.icon }
            }
            // For custom items, restore icon from iconMap
            const iconComponent = iconMap[item.iconName as keyof typeof iconMap] || Gem
            return { ...item, icon: iconComponent }
          })
        }

        setInventory(restoreIcons(gameState.inventory))
        setDissectables(restoreIcons(gameState.dissectables))
        setTools(restoreIcons(gameState.tools))
        setCraftedItems(
          gameState.craftedItems.map((item: any) => {
            const typeInfo = itemTypes[item.type as keyof typeof itemTypes]
            return { ...item, icon: typeInfo?.icon || Gem }
          }),
        )
        setCraftingHistory(gameState.craftingHistory || [])
        setDissectionHistory(gameState.dissectionHistory || [])
        setLastSaved(gameState.lastSaved)
        setSaveStatus("saved")

        setAiSuggestion(
          `🎮 Játék automatikusan betöltve! Utolsó mentés: ${new Date(gameState.lastSaved).toLocaleString()}`,
        )
      } else {
        // Ha nincs mentett játék, alapértelmezett állapot
        resetToDefault()
      }
    } catch (error) {
      console.error("Load failed:", error)
      setSaveStatus("error")
      resetToDefault()
    }
  }

  const resetToDefault = () => {
    setInventory(defaultGameState.inventory)
    setDissectables(defaultGameState.dissectables)
    setTools(defaultGameState.tools)
    setCraftedItems(defaultGameState.craftedItems)
    setCraftingHistory(defaultGameState.craftingHistory)
    setDissectionHistory(defaultGameState.dissectionHistory)
    setLastSaved(defaultGameState.lastSaved)
    setSaveStatus("unsaved")
  }

  // Export funkció
  const exportGame = () => {
    const gameState: GameState = {
      inventory,
      dissectables,
      tools,
      craftedItems,
      craftingHistory,
      dissectionHistory,
      lastSaved: new Date().toISOString(),
    }

    const exportString = JSON.stringify(gameState, null, 2)
    // setExportData(exportString)

    // Automatikus letöltés
    const blob = new Blob([exportString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `dnd-craft-save-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import funkció
  const importGame = () => {
    // try {
    //   const gameState: GameState = JSON.parse(importData)
    //   // Restore icons
    //   const restoreIcons = (items: any[]) => {
    //     return items.map((item: any) => {
    //       const originalItem = [...materials, ...dissectableItems, ...dissectionTools].find(
    //         (orig) => orig.id === item.id,
    //       )
    //       return originalItem ? { ...item, icon: originalItem.icon } : item
    //     })
    //   }
    //   setInventory(restoreIcons(gameState.inventory))
    //   setDissectables(restoreIcons(gameState.dissectables))
    //   setTools(restoreIcons(gameState.tools))
    //   setCraftedItems(
    //     gameState.craftedItems.map((item: any) => {
    //       const typeInfo = itemTypes[item.type as keyof typeof itemTypes]
    //       return { ...item, icon: typeInfo?.icon || Gem }
    //     }),
    //   )
    //   setCraftingHistory(gameState.craftingHistory || [])
    //   setDissectionHistory(gameState.dissectionHistory || [])
    //   setLastSaved(new Date().toISOString())
    //   saveGameState()
    //   setImportData("")
    //   setAiSuggestion("🎮 Játék sikeresen importálva!")
    // } catch (error) {
    //   console.error("Import failed:", error)
    //   setAiSuggestion("❌ Import hiba! Ellenőrizd a JSON formátumot.")
    // }
  }

  // DM Authentication
  const authenticateDM = () => {
    if (dmPassword === "dm1234") {
      setIsDMAuthenticated(true)
      sessionStorage.setItem("dm-authenticated", "true")
      setDmPassword("")
      setAiSuggestion("🔓 DM mód aktiválva! Most hozzáadhatsz új anyagokat.")
    } else {
      setAiSuggestion("❌ Hibás DM jelszó!")
      setDmPassword("")
    }
  }

  const logoutDM = () => {
    setIsDMAuthenticated(false)
    sessionStorage.removeItem("dm-authenticated")
    setAiSuggestion("🔒 DM mód deaktiválva.")
  }

  // Add new item as DM
  const addNewItem = () => {
    if (!newItemName.trim()) {
      setAiSuggestion("❌ Add meg az item nevét!")
      return
    }

    const iconComponent = iconMap[newItemIcon as keyof typeof iconMap] || Gem
    const properties = newItemProperties
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    const newItem: Item & { quantity: number } = {
      id: `custom_${Date.now()}`,
      name: newItemName,
      type: newItemType as any,
      rarity: newItemRarity as any,
      icon: iconComponent,
      description: newItemDescription || `Custom ${newItemType} created by DM`,
      properties: properties.length > 0 ? properties : [newItemType, newItemRarity],
      quantity: newItemQuantity,
      iconName: newItemIcon, // Store icon name for saving
    } as any

    if (addToInventory) {
      // Add to inventory (materials)
      const existingItem = inventory.find((item) => item.name === newItem.name)
      if (existingItem) {
        setInventory((prev) =>
          prev.map((item) =>
            item.name === newItem.name ? { ...item, quantity: item.quantity + newItem.quantity } : item,
          ),
        )
      } else {
        setInventory((prev) => [...prev, newItem])
      }
    } else {
      // Add to dissectables
      const existingItem = dissectables.find((item) => item.name === newItem.name)
      if (existingItem) {
        setDissectables((prev) =>
          prev.map((item) =>
            item.name === newItem.name ? { ...item, quantity: item.quantity + newItem.quantity } : item,
          ),
        )
      } else {
        setDissectables((prev) => [...prev, newItem])
      }
    }

    // Reset form
    setNewItemName("")
    setNewItemDescription("")
    setNewItemProperties("")
    setNewItemQuantity(1)
    setDmDialogOpen(false)

    setAiSuggestion(
      `✅ Új item hozzáadva: ${newItem.name} (${newItem.quantity}x) a ${addToInventory ? "materials" : "dissectables"} listához!`,
    )
  }

  // Betöltés az oldal indításakor
  useEffect(() => {
    loadGameState()

    // Check DM authentication from session
    const dmAuth = sessionStorage.getItem("dm-authenticated")
    if (dmAuth === "true") {
      setIsDMAuthenticated(true)
    }

    // Auto-save on page unload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      saveGameState()
      // Optional: Show confirmation dialog
      // e.preventDefault()
      // e.returnValue = ''
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  // Auto-save minden változáskor
  useEffect(() => {
    if (inventory.length > 0) {
      setSaveStatus("unsaved")
      const timeoutId = setTimeout(() => {
        setSaveStatus("saving")
        setTimeout(saveGameState, 500)
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [inventory, dissectables, tools, craftedItems, craftingHistory, dissectionHistory])

  const addToCrafting = (item: Item & { quantity: number }) => {
    if (item.quantity > 0) {
      const existingSlot = craftingSlots.find((slot) => slot.id === item.id)
      if (existingSlot) {
        setCraftingSlots((prev) =>
          prev.map((slot) => (slot.id === item.id ? { ...slot, quantity: slot.quantity + 1 } : slot)),
        )
      } else {
        setCraftingSlots((prev) => [...prev, { ...item, quantity: 1 }])
      }

      setInventory((prev) =>
        prev
          .map((invItem) => (invItem.id === item.id ? { ...invItem, quantity: invItem.quantity - 1 } : invItem))
          .filter((invItem) => invItem.quantity > 0),
      )
    }
  }

  const removeFromCrafting = (item: Item & { quantity: number }) => {
    setCraftingSlots((prev) =>
      prev
        .map((slot) => (slot.id === item.id ? { ...slot, quantity: slot.quantity - 1 } : slot))
        .filter((slot) => slot.quantity > 0),
    )

    const existingInv = inventory.find((invItem) => invItem.id === item.id)
    if (existingInv) {
      setInventory((prev) =>
        prev.map((invItem) => (invItem.id === item.id ? { ...invItem, quantity: invItem.quantity + 1 } : invItem)),
      )
    } else {
      setInventory((prev) => [...prev, { ...item, quantity: 1 }])
    }
  }

  const generateDissectionResults = (dissectable: Item, tool: Item) => {
    const results: (Item & { quantity: number })[] = []
    const toolEfficiency = rarityValues[tool.rarity]
    const sourceRarity = rarityValues[dissectable.rarity]

    const baseCount = Math.max(1, Math.floor((sourceRarity + toolEfficiency) / 2))
    const bonusChance = toolEfficiency * 0.2 + sourceRarity * 0.1

    const materialCount = Math.min(4, Math.max(1, baseCount + (Math.random() > 0.7 ? 1 : 0)))

    for (let i = 0; i < materialCount; i++) {
      const materialProps = [...dissectable.properties]

      let materialName = ""
      let materialIcon = Mountain
      let materialRarity: keyof typeof rarityValues = "common"
      let newProperties: string[] = []

      if (materialProps.includes("bone")) {
        materialName = "Bone Fragment"
        materialIcon = Skull
        newProperties = ["bone", "sturdy", "death"]
        materialRarity = "common"
      } else if (materialProps.includes("scales")) {
        materialName = "Scale Fragment"
        materialIcon = Shield
        newProperties = ["scales", "protection", "dragon"]
        materialRarity = Math.random() > 0.5 ? "rare" : "uncommon"
      } else if (materialProps.includes("feathers")) {
        materialName = "Mystical Feather"
        materialIcon = Flame
        newProperties = ["feathers", "fire", "flight"]
        materialRarity = "epic"
      } else if (materialProps.includes("wood")) {
        materialName = "Enchanted Wood"
        materialIcon = Leaf
        newProperties = ["wood", "nature", "magic"]
        materialRarity = "uncommon"
      } else if (materialProps.includes("crystal")) {
        materialName = "Crystal Shard"
        materialIcon = Gem
        newProperties = ["crystal", "magic", "energy"]
        materialRarity = "rare"
      } else if (materialProps.includes("essence")) {
        materialName = "Dark Essence"
        materialIcon = Eye
        newProperties = ["essence", "shadow", "magic"]
        materialRarity = "epic"
      } else if (materialProps.includes("petals")) {
        materialName = "Moon Petal"
        materialIcon = Star
        newProperties = ["petals", "moon", "light"]
        materialRarity = "uncommon"
      } else if (materialProps.includes("ore")) {
        materialName = "Raw Ore"
        materialIcon = Mountain
        newProperties = ["ore", "metal", "sturdy"]
        materialRarity = "common"
      } else {
        materialName = "Strange Material"
        materialIcon = Gem
        newProperties = materialProps.slice(0, 2)
        materialRarity = "common"
      }

      if (Math.random() < bonusChance) {
        const rarities: (keyof typeof rarityValues)[] = ["common", "uncommon", "rare", "epic", "legendary"]
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

  const performDissection = () => {
    if (!selectedDissectable || !selectedTool) {
      setAiSuggestion("❌ Válassz egy boncolandó tárgyat és egy eszközt!")
      return
    }

    const results = generateDissectionResults(selectedDissectable, selectedTool)

    results.forEach((result) => {
      const existingItem = inventory.find((item) => item.name === result.name)
      if (existingItem) {
        setInventory((prev) =>
          prev.map((item) =>
            item.name === result.name ? { ...item, quantity: item.quantity + result.quantity } : item,
          ),
        )
      } else {
        setInventory((prev) => [...prev, result])
      }
    })

    setDissectables((prev) =>
      prev
        .map((item) => (item.id === selectedDissectable.id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )

    const resultNames = results.map((r) => `${r.name} x${r.quantity}`).join(", ")
    const historyEntry = `${selectedDissectable.name} -> ${resultNames} (${selectedTool.name})`
    setDissectionHistory((prev) => [historyEntry, ...prev.slice(0, 9)])

    setAiSuggestion(
      `🔪 Sikeresen boncolás! ${selectedDissectable.name} -> ${results.length} különböző anyag: ${results.map((r) => r.name).join(", ")}`,
    )

    setSelectedDissectable(null)
  }

  const generateCraftedItem = (materials: (Item & { quantity: number })[]) => {
    if (materials.length === 0) return null

    const allProperties = materials.flatMap((mat) => mat.properties)
    const uniqueProperties = [...new Set(allProperties)]

    const totalRarityValue = materials.reduce((sum, mat) => sum + rarityValues[mat.rarity] * mat.quantity, 0)
    const totalQuantity = materials.reduce((sum, mat) => sum + mat.quantity, 0)
    const avgRarity = Math.round(totalRarityValue / totalQuantity)

    let resultRarity: keyof typeof rarityValues = "common"
    if (avgRarity >= 5) resultRarity = "legendary"
    else if (avgRarity >= 4) resultRarity = "epic"
    else if (avgRarity >= 3) resultRarity = "rare"
    else if (avgRarity >= 2) resultRarity = "uncommon"

    const luck = Math.random()
    if (luck > 0.9 && resultRarity !== "legendary") {
      const rarities: (keyof typeof rarityValues)[] = ["common", "uncommon", "rare", "epic", "legendary"]
      const currentIndex = rarities.indexOf(resultRarity)
      if (currentIndex < rarities.length - 1) {
        resultRarity = rarities[currentIndex + 1]
      }
    }

    let itemType: keyof typeof itemTypes = "accessory"

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
      if (prefixes[prop as keyof typeof prefixes]) {
        const options = prefixes[prop as keyof typeof prefixes]
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

  const craftItem = () => {
    if (craftingSlots.length === 0) return

    const craftedItem = generateCraftedItem(craftingSlots)

    if (craftedItem) {
      setCraftedItems((prev) => [...prev, craftedItem])
      setCraftingSlots([])

      const materialNames = craftingSlots.map((slot) => `${slot.name} x${slot.quantity}`).join(", ")
      const historyEntry = `${craftedItem.name} (${craftedItem.rarity}) <- ${materialNames}`
      setCraftingHistory((prev) => [historyEntry, ...prev.slice(0, 9)])

      setAiSuggestion(
        `🎉 Sikeresen elkészítetted: ${craftedItem.name}! Ez egy ${craftedItem.rarity} ritkaságú ${craftedItem.type}. A kombinált tulajdonságok: ${craftedItem.properties.join(", ")}.`,
      )
    } else {
      setAiSuggestion("❌ A crafting nem sikerült. Próbálj más anyagokat!")
    }
  }

  const getAiSuggestion = () => {
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
      setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
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

    setAiSuggestion(suggestion)
  }

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case "saved":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "saving":
        return <Save className="w-4 h-4 text-yellow-400 animate-spin" />
      case "unsaved":
        return <AlertCircle className="w-4 h-4 text-orange-400" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Save className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-black">
      <div className="container mx-auto p-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ⚔️ AI Mystical Forge & Dissection Lab ⚔️
          </h1>
          <p className="text-lg text-gray-300">Dynamic Crafting & Dissection - Auto-Save Enabled!</p>

          {/* Save Status & Controls */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              {getSaveStatusIcon()}
              <span>
                {saveStatus === "saved" && `Auto-mentve: ${new Date(lastSaved).toLocaleTimeString()}`}
                {saveStatus === "saving" && "Mentés..."}
                {saveStatus === "unsaved" && "Változások mentésre várnak"}
                {saveStatus === "error" && "Mentési hiba"}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={saveGameState}
                className="text-xs border-green-500 text-green-400 hover:bg-green-500 hover:text-black bg-transparent"
              >
                <Save className="w-3 h-3 mr-1" />
                Mentés Most
              </Button>

              {/* DM Panel */}
              <Dialog open={dmDialogOpen} onOpenChange={setDmDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`text-xs ${
                      isDMAuthenticated
                        ? "border-purple-500 text-purple-400 hover:bg-purple-500"
                        : "border-red-500 text-red-400 hover:bg-red-500"
                    } hover:text-black bg-transparent`}
                  >
                    {isDMAuthenticated ? <Unlock className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                    DM Panel
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-black flex items-center gap-2">
                      <UserCog className="w-5 h-5" />
                      DM Control Panel
                    </DialogTitle>
                    <DialogDescription>
                      {isDMAuthenticated ? "Add new items to the game" : "Enter DM password to access"}
                    </DialogDescription>
                  </DialogHeader>

                  {!isDMAuthenticated ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dm-password" className="text-black">
                          DM Password:
                        </Label>
                        <Input
                          id="dm-password"
                          type="password"
                          value={dmPassword}
                          onChange={(e) => setDmPassword(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-black"
                          placeholder="Enter DM password..."
                          onKeyPress={(e) => e.key === "Enter" && authenticateDM()}
                        />
                      </div>
                      <Button onClick={authenticateDM} className="w-full">
                        <Lock className="w-4 h-4 mr-2" />
                        Authenticate
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 text-sm">✅ DM Authenticated</span>
                        <Button size="sm" variant="outline" onClick={logoutDM}>
                          <Lock className="w-3 h-3 mr-1" />
                          Logout
                        </Button>
                      </div>

                      {/* DM Action Tabs */}
                      <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                          <TabsTrigger value="general" className="text-xs">
                            General Items
                          </TabsTrigger>
                          <TabsTrigger value="corpses" className="text-xs">
                            Add Corpses
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="mt-4">
                          <div className="space-y-3">
                            <div>
                              <Label className="text-black">Item Name:</Label>
                              <Input
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-black"
                                placeholder="Enter item name..."
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-black">Type:</Label>
                                <Select value={newItemType} onValueChange={setNewItemType}>
                                  <SelectTrigger className="bg-slate-700 border-slate-600 text-black">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-700 border-slate-600">
                                    <SelectItem value="material">Material</SelectItem>
                                    <SelectItem value="creature">Creature</SelectItem>
                                    <SelectItem value="plant">Plant</SelectItem>
                                    <SelectItem value="mineral">Mineral</SelectItem>
                                    <SelectItem value="tool">Tool</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-black">Rarity:</Label>
                                <Select value={newItemRarity} onValueChange={setNewItemRarity}>
                                  <SelectTrigger className="bg-slate-700 border-slate-600 text-black">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-700 border-slate-600">
                                    <SelectItem value="common">Common</SelectItem>
                                    <SelectItem value="uncommon">Uncommon</SelectItem>
                                    <SelectItem value="rare">Rare</SelectItem>
                                    <SelectItem value="epic">Epic</SelectItem>
                                    <SelectItem value="legendary">Legendary</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-black">Icon:</Label>
                                <Select value={newItemIcon} onValueChange={setNewItemIcon}>
                                  <SelectTrigger className="bg-slate-700 border-slate-600 text-black">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-700 border-slate-600">
                                    {Object.keys(iconMap).map((iconName) => (
                                      <SelectItem key={iconName} value={iconName}>
                                        {iconName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-black">Quantity:</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={newItemQuantity}
                                  onChange={(e) => setNewItemQuantity(Number.parseInt(e.target.value) || 1)}
                                  className="bg-slate-700 border-slate-600 text-black"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-black">Description:</Label>
                              <Textarea
                                value={newItemDescription}
                                onChange={(e) => setNewItemDescription(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-black"
                                placeholder="Item description..."
                                rows={2}
                              />
                            </div>

                            <div>
                              <Label className="text-black">Properties (comma separated):</Label>
                              <Input
                                value={newItemProperties}
                                onChange={(e) => setNewItemProperties(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-black"
                                placeholder="magic, fire, rare..."
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="add-to-inventory"
                                checked={addToInventory}
                                onChange={(e) => setAddToInventory(e.target.checked)}
                                className="rounded"
                              />
                              <Label htmlFor="add-to-inventory" className="text-black text-sm">
                                Add to Materials (unchecked = add to Dissectables)
                              </Label>
                            </div>

                            <Button onClick={addNewItem} className="w-full bg-purple-600 hover:bg-purple-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Item
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="corpses" className="mt-4">
                          <div className="space-y-3">
                            <div className="text-center text-sm text-gray-300 mb-3">
                              🔪 Quick Add Corpses for Dissection
                            </div>

                            <div>
                              <Label className="text-black">Creature Name:</Label>
                              <Input
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-black"
                                placeholder="e.g., Orc Warrior, Ancient Dragon..."
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-black">Creature Size:</Label>
                                <Select value={newItemRarity} onValueChange={setNewItemRarity}>
                                  <SelectTrigger className="bg-slate-700 border-slate-600 text-black">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-700 border-slate-600">
                                    <SelectItem value="common">Small (Goblin, Rat)</SelectItem>
                                    <SelectItem value="uncommon">Medium (Human, Orc)</SelectItem>
                                    <SelectItem value="rare">Large (Troll, Bear)</SelectItem>
                                    <SelectItem value="epic">Huge (Giant, Wyvern)</SelectItem>
                                    <SelectItem value="legendary">Colossal (Dragon, Titan)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-black">Corpse Type:</Label>
                                <Select
                                  value={newItemIcon}
                                  onValueChange={(value) => {
                                    setNewItemIcon(value)
                                    // Auto-set properties based on corpse type
                                    if (value === "Skull") {
                                      setNewItemProperties("creature, bone, flesh, corpse")
                                    } else if (value === "Flame") {
                                      setNewItemProperties("creature, fire, scales, magical")
                                    } else if (value === "Eye") {
                                      setNewItemProperties("creature, shadow, essence, dark")
                                    } else if (value === "TreePine") {
                                      setNewItemProperties("creature, nature, wood, plant")
                                    }
                                  }}
                                >
                                  <SelectTrigger className="bg-slate-700 border-slate-600 text-black">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-700 border-slate-600">
                                    <SelectItem value="Skull">💀 Undead/Bone</SelectItem>
                                    <SelectItem value="Flame">🔥 Fire Creature</SelectItem>
                                    <SelectItem value="Eye">👁️ Shadow Beast</SelectItem>
                                    <SelectItem value="TreePine">🌲 Nature Spirit</SelectItem>
                                    <SelectItem value="Mountain">⛰️ Earth Elemental</SelectItem>
                                    <SelectItem value="Wind">💨 Air Elemental</SelectItem>
                                    <SelectItem value="Droplets">💧 Water Creature</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label className="text-black">Quantity:</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={newItemQuantity}
                                onChange={(e) => setNewItemQuantity(Number.parseInt(e.target.value) || 1)}
                                className="bg-slate-700 border-slate-600 text-black"
                              />
                            </div>

                            <div>
                              <Label className="text-black">Special Description (optional):</Label>
                              <Textarea
                                value={newItemDescription}
                                onChange={(e) => setNewItemDescription(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-black"
                                placeholder="e.g., 'Slain in the northern mountains', 'Corrupted by dark magic'..."
                                rows={2}
                              />
                            </div>

                            <div>
                              <Label className="text-black">Additional Properties:</Label>
                              <Input
                                value={newItemProperties}
                                onChange={(e) => setNewItemProperties(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-black"
                                placeholder="Auto-filled based on type, add more if needed..."
                              />
                            </div>

                            <div className="bg-slate-700/50 p-3 rounded-lg">
                              <div className="text-xs text-gray-300 mb-2">Preview:</div>
                              <div className="text-sm text-black">{newItemName || "Creature Name"} Corpse</div>
                              <div className="text-xs text-gray-400">
                                {newItemDescription || `Remains of a defeated ${newItemName || "creature"}`}
                              </div>
                              <div className="text-xs text-blue-300 mt-1">
                                Properties: {newItemProperties || "creature, corpse"}
                              </div>
                            </div>

                            <Button
                              onClick={() => {
                                if (!newItemName.trim()) {
                                  setAiSuggestion("❌ Add meg a creature nevét!")
                                  return
                                }

                                const iconComponent = iconMap[newItemIcon as keyof typeof iconMap] || Skull
                                const properties = newItemProperties
                                  .split(",")
                                  .map((p) => p.trim())
                                  .filter((p) => p.length > 0)

                                const corpseItem: Item & { quantity: number } = {
                                  id: `corpse_${Date.now()}`,
                                  name: `${newItemName} Corpse`,
                                  type: "creature",
                                  rarity: newItemRarity as any,
                                  icon: iconComponent,
                                  description: newItemDescription || `Remains of a defeated ${newItemName}`,
                                  properties:
                                    properties.length > 0 ? properties : ["creature", "corpse", "bone", "flesh"],
                                  quantity: newItemQuantity,
                                  iconName: newItemIcon,
                                } as any

                                // Add directly to dissectables (NOT materials)
                                const existingCorpse = dissectables.find((item) => item.name === corpseItem.name)
                                if (existingCorpse) {
                                  setDissectables((prev) =>
                                    prev.map((item) =>
                                      item.name === corpseItem.name
                                        ? { ...item, quantity: item.quantity + corpseItem.quantity }
                                        : item,
                                    ),
                                  )
                                } else {
                                  setDissectables((prev) => [...prev, corpseItem])
                                }

                                // Reset corpse form
                                setNewItemName("")
                                setNewItemDescription("")
                                setNewItemProperties("")
                                setNewItemQuantity(1)
                                setDmDialogOpen(false)

                                setAiSuggestion(
                                  `💀 Új corpse hozzáadva: ${corpseItem.name} (${corpseItem.quantity}x) a Dissection Lab-hoz!`,
                                )
                              }}
                              className="w-full bg-red-600 hover:bg-red-700"
                              disabled={!newItemName.trim()}
                            >
                              <Skull className="w-4 h-4 mr-2" />
                              Add Corpse to Dissection Lab
                            </Button>

                            <div className="text-xs text-gray-400 text-center">
                              💡 Corpses are automatically added to the Dissection Lab
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Inventory */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Crown className="w-5 h-5" />
                Materials ({inventory.reduce((sum, item) => sum + item.quantity, 0)})
              </CardTitle>
              <CardDescription>Your crafting materials</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                      onClick={() => addToCrafting(item)}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-gray-300" />
                        <div>
                          <div className="font-medium text-xs">{item.name}</div>
                          <Badge className={`${rarityColors[item.rarity]} text-black text-xs`}>{item.rarity}</Badge>
                          <div className="text-xs text-gray-400">{item.properties.slice(0, 2).join(", ")}</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.quantity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Crafting Area */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Wand2 className="w-5 h-5" />
                AI Crafting
              </CardTitle>
              <CardDescription>Combine materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="min-h-32 p-3 border-2 border-dashed border-slate-600 rounded-lg">
                {craftingSlots.length === 0 ? (
                  <div className="text-center text-gray-400 py-4">
                    <Plus className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-xs">Add materials</div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {craftingSlots.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-1 bg-slate-700 rounded text-xs">
                        <div className="flex items-center gap-1">
                          <item.icon className="w-3 h-3" />
                          <span>{item.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs h-4">
                            {item.quantity}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCrafting(item)}
                            className="h-4 w-4 p-0 hover:bg-red-600"
                          >
                            <Trash2 className="w-2 h-2" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={craftItem}
                  disabled={craftingSlots.length === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Craft!
                </Button>
                <Button
                  onClick={getAiSuggestion}
                  variant="outline"
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black bg-transparent text-xs"
                >
                  <Zap className="w-3 h-3" />
                </Button>
              </div>

              {aiSuggestion && (
                <div className="p-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-500/30">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-100">{aiSuggestion}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dissection Lab */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Scissors className="w-5 h-5" />
                Dissection Lab
              </CardTitle>
              <CardDescription>Extract materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tools */}
              <div>
                <div className="text-xs text-gray-400 mb-2">Select Tool:</div>
                <div className="flex gap-1 flex-wrap">
                  {tools.map((tool) => (
                    <Button
                      key={tool.id}
                      size="sm"
                      variant={selectedTool?.id === tool.id ? "default" : "outline"}
                      onClick={() => setSelectedTool(tool)}
                      className="text-xs h-6"
                    >
                      <tool.icon className="w-3 h-3 mr-1" />
                      {tool.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Dissectables */}
              <div>
                <div className="text-xs text-gray-400 mb-2">
                  Dissectables ({dissectables.reduce((sum, item) => sum + item.quantity, 0)}):
                </div>
                <ScrollArea className="h-40">
                  <div className="space-y-1">
                    {dissectables.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                          selectedDissectable?.id === item.id
                            ? "bg-red-600/30 border border-red-500"
                            : "bg-slate-700/50 hover:bg-slate-700"
                        }`}
                        onClick={() => setSelectedDissectable(item)}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <Badge className={`${rarityColors[item.rarity]} text-black text-xs`}>{item.rarity}</Badge>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {item.quantity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Button
                onClick={performDissection}
                disabled={!selectedTool || !selectedDissectable}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-xs"
              >
                <Knife className="w-3 h-3 mr-1" />
                Dissect!
              </Button>
            </CardContent>
          </Card>

          {/* Results & History */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Star className="w-5 h-5" />
                Results ({craftedItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="crafted" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700 text-xs">
                  <TabsTrigger value="crafted" className="text-xs">
                    Crafted
                  </TabsTrigger>
                  <TabsTrigger value="craft-history" className="text-xs">
                    C.History
                  </TabsTrigger>
                  <TabsTrigger value="dissect-history" className="text-xs">
                    D.History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="crafted" className="mt-4">
                  <ScrollArea className="h-80">
                    {craftedItems.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        <Gem className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs">No items crafted yet</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {craftedItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/30"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <item.icon className="w-4 h-4 text-yellow-400" />
                              <div className="flex-1">
                                <div className="font-medium text-xs">{item.name}</div>
                                <Badge className={`${rarityColors[item.rarity]} text-black text-xs`}>
                                  {item.rarity}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-xs text-gray-300 mb-1">{item.description}</div>
                            <div className="text-xs text-blue-300">Properties: {item.properties.join(", ")}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="craft-history" className="mt-4">
                  <ScrollArea className="h-80">
                    {craftingHistory.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        <Scroll className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs">No crafting history</div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {craftingHistory.map((entry, idx) => (
                          <div key={idx} className="p-2 bg-slate-700/30 rounded text-xs text-gray-300">
                            {entry}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="dissect-history" className="mt-4">
                  <ScrollArea className="h-80">
                    {dissectionHistory.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        <Knife className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs">No dissection history</div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {dissectionHistory.map((entry, idx) => (
                          <div key={idx} className="p-2 bg-slate-700/30 rounded text-xs text-gray-300">
                            {entry}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
