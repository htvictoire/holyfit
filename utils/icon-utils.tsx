import * as LucideIcons from "lucide-react"
import { createElement } from "react"

/**
 * Dynamically renders a Lucide icon by name
 * @param iconName The name of the Lucide icon to render
 * @param props Additional props to pass to the icon component
 * @returns The rendered icon or null if the icon doesn't exist
 */
export function DynamicIcon({
  iconName,
  ...props
}: {
  iconName: string
  [key: string]: any
}) {
  if (!iconName) return null

  // Check if the icon exists in Lucide
  const IconComponent = (LucideIcons as any)[iconName]

  if (IconComponent) {
    return createElement(IconComponent, props)
  }

  // Fallback to a default icon if the specified one doesn't exist
  return createElement(LucideIcons.HelpCircle, props)
}
