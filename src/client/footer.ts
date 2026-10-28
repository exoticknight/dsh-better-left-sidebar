/** Build the plugin-owned click-mode toggle; native DSH tools remain in their owner slot. */
export function createNavigationToggle(onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'dsh-better-left-sidebar-toggle'
  button.setAttribute('data-dsh-better-left-sidebar-toggle', '')
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.setAttribute('viewBox', '0 0 24 24')
  icon.setAttribute('width', '18')
  icon.setAttribute('height', '18')
  icon.setAttribute('aria-hidden', 'true')
  icon.innerHTML = '<rect x="3.5" y="4" width="17" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 4.5v15" stroke="currentColor" stroke-width="1.6"/><path data-dsh-better-left-sidebar-toggle-chevron="" d="m14 9 3 3-3 3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>'
  const iconWrap = document.createElement('span')
  iconWrap.setAttribute('data-dsh-better-left-sidebar-toggle-icon', '')
  iconWrap.append(icon)
  const label = document.createElement('span')
  label.setAttribute('data-dsh-better-left-sidebar-toggle-label', '')
  button.append(iconWrap, label)
  button.addEventListener('click', onClick)
  return button
}
