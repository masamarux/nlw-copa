import { Box, FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { api } from '../lib/axios';
import { EmptyMyPollList } from './EmptyMyPollList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')
  const [games, setGames] = useState<GameProps[]>([])
  const toast = useToast()

  async function fetchGames() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${pollId}/games`)
      setGames(response.data.games)
    } catch(error) {
      console.log(error)

      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        bgColor: 'red.500',
      })
    }finally{
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      setIsLoading(true);
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500',
        })
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      })
      
      toast.show({
        title: 'Palpite realizado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      })

      await fetchGames()
    } catch(error) {
      console.log(error)

      toast.show({
        title: 'Não foi possível enviar o palpite',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames()
  }, [pollId])

  if(isLoading) {
    return <Loading />
  }

  return (
    <FlatList
      data={[]}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{pb:10}}
      ListEmptyComponent={() => <EmptyMyPollList code={code} />}
    />
  );
}
