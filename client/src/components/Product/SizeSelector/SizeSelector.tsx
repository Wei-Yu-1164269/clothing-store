import type { SizeOption } from '../../../types/product'
import styles from './SizeSelector.module.css'

type Props = {
  options: SizeOption[]
  selectedSizeId: number | null
  onChange: (sizeId: number) => void
  showError?: boolean
}

export default function SizeSelector({
  options,
  selectedSizeId,
  onChange,
  showError = false,
}: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.labelRow}>
        <span className={styles.label}>SIZE</span>
        <span className={styles.required}>*</span>
        {showError && <span className={styles.error}>Please select a size</span>}
      </div>

      <div className={styles.btnRow}>
        {options.map((opt) => {
          const active = opt.id === selectedSizeId
          return (
            <button
              key={opt.id}
              type="button"
              className={`${styles.sizeBtn} ${active ? styles.active : ''}`}
              onClick={() => onChange(opt.id)}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
