import { Button as ButtonNB, Text, IButtonProps } from 'native-base'

interface ButtonProps extends IButtonProps {
  title: string
  variant?: 'primary' | 'secondary'
}

export function Button({ title, variant, ...rest }: ButtonProps) {
  return (
    <ButtonNB 
      w="full"
      h={14}
      rounded="sm"
      fontSize="md"
      textTransform="uppercase"
      bg={variant === 'secondary' ? 'red.500' : 'yellow.500'}

      _pressed={{
        bg: variant === 'secondary' ? 'red.600' : 'yellow.600',
      }}

      _loading={{
        _spinner: {color: variant === 'secondary' ? 'white' : 'black'}
      }}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        textTransform="uppercase"
        color={variant === 'secondary' ? 'white' : 'black'}
      >{title}</Text>
    </ButtonNB>
  )
}