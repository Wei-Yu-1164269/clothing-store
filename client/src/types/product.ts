export type SizeOption = {
  id: number
  label: string
}

export type Product = {
  id: number
  title: string
  description: string
  imageURL: string
  price: number
  sizeOptions: SizeOption[]
}
