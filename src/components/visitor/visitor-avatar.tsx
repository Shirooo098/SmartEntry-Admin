export function Avatar({ name, avatarUri }: { name: string; avatarUri?: string }) {
  if (avatarUri) {
    return <img src={avatarUri} className="w-9 h-9 rounded-full object-cover shrink-0" alt={name} />
  }
  return (
    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}
 