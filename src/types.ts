export type PriorityType = 'low' | 'medium' | 'high'
export type CategoryType = 'Work' | 'Personal' | 'Urgent' | 'Project' | 'Other'

export type Task = {
  id: number
  title: string
  status: 'todo' | 'doing' | 'done'
  priority: PriorityType
  category: CategoryType
  createdAt: number
}
