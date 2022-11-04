import { Center, Text, Icon } from 'native-base';
import { Fontisto } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button';
import Logo from '../assets/logo.svg';


export function SignIn() {
  const { signIn, isUserLoading } = useAuth()

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40} />

      <Button
        title='Entrar com o Google'
        leftIcon={<Icon as={Fontisto}
        name="google" color="white" size="md" />}
        variant="secondary"
        mt={12}
        onPress={signIn}
        isLoading={isUserLoading}
      />

      <Text
        color="white"
        textAlign="center"
        maxW={268}
        mt={4}
      >
        Não utilizamos nenhuma informação além do seu e-mail para criação de sua conta.
      </Text>
    </Center>
  )
}