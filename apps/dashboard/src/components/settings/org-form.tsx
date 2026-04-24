'use client'

import { Button, TextInput, Stack } from '@mantine/core'
import { useForm, isNotEmpty } from '@mantine/form'

interface OrgFormProps {
  defaultName?: string
  onSubmit: (name: string) => void
  isLoading?: boolean
}

export function OrgForm({ defaultName, onSubmit, isLoading }: OrgFormProps) {
  const form = useForm({
    initialValues: { name: defaultName ?? '' },
    validate: {
      name: isNotEmpty('Organization name is required'),
    },
  })

  return (
    <form onSubmit={form.onSubmit((v) => onSubmit(v.name))}>
      <Stack gap="md">
        <TextInput
          label="Organization Name"
          {...form.getInputProps('name')}
        />
        <Button type="submit" loading={isLoading} size="sm">
          Save Changes
        </Button>
      </Stack>
    </form>
  )
}
