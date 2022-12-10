- References
  - https://www.jogatina.com/regras-como-jogar-bingo.html#:~:text=Cada%20jogador%20pode%20usar%20de,com%20o%20padr%C3%A3o%20da%20fase.



NOTAS DE ATUALIZAÇÃO
  01-07-22-01_is_functional
    - primeira versão da aplicação
    - as principais funções já foram implementadas

  XX-XX-XX
    - agora os cards mudam de id sempre que são modificados, o que permite um controle de modificação de cards por exemplo para partidas amistosas
    -

DOING
  - salvar configurações de personalização no localStorage
    - adicionar valores ao botoes de casa opção
  - fazer o tema dark
  - adicionar uma propriedade "selected" em todas as opções de personalização
    - para padronificar setValues
  - unificar todos os itens do localStore em um item só ??????
    - vai ter que salvar mais coisas mais vezes
    - fazer pra modificar só uma propiedade e salvar no localStorage
  
  
DONE
  DONE- não traduzir icons
  DONE- traduzir mensagens de erro do card input
  DONE- mudar cartela parece que não muda o id
    ABOUT- agora muda o cartão já tiver sido salvo once
  DONE- desfazer remover card permite recuperar vários cards
    - isso buga na hora de marcar os cards e de removê-los, provavelmente por conflitos de ids
  DONE - notificações foram otimizadas
  DONE- sempre que entrar na pagina de configurações checar import novamente
    - parece que não está mostrando se um card é novo ou não
    - pode ser por causa do ID
    ABOUT - é que dá probrema com findPreveiw(), então tem que comentar enquanto configura pagesSettings



TODO
  DONE- evitar numeros repetidos na cartela de inputs
  DONE- visualização das bolas
    - por ordem de saída
    - ou visão geral de todas as bolas na ordem crescente
    - why not both?
  - projeções durante o input do numero, pra ver em quantas cartelas teria se saisse
      - marca em todas as cartelas, cor opaca, azul?
  DONE- colocar mensagem ao entrar na página se o navegador dar suporte para localStoraje

  - random numbers no inputCard
    - talvez dê para fazer um bingo, ai é só anotar o id dos participantes, depois que a cartela for criada
    - então vai ter que mostrar o id na cartela

  DONE- refazer cardInput
    DONE- quando dá enter no cardImput recarrega a página
    DONE- não permitir números repetidos
    DONE- mensagens para indicar erro com cardInput
    DONE- mensagem confirmando cancelamento só quando cardInput é modificado
    ? não adicionar um novo card até ter sido salvo pela primeira vez
      - melhora a perfomace

  - colocar logo no meio dos cards e entre o botão moreOptions

  DONE - deixar o scroll do allCards mais para dentro
    - ABOUT - with border em ::-webkit-scrollbar-thumb

  DONE- refazer forma de adicionar card, mais simples e automática
  
  - deixar todos os botões do mesmo tamanho com uma variável

  - cartela, diminuir gap horizontal e aumentar vertical para parecer colunas e não linhas

  DONE- não traduzir material-icons, se não não mostra
  DONE- colocar text-transform:lowercase


  - WIN
    - allCards rola até a cartela
    - a cartela campeã muda cor, dourada
      - com efeitos de luz passando, como brilho
    - a pedra campeã fica com efeito de ondas de sinal e é dourada
    - a penultima fica um pouco mais clara
    - as demais ficam transparentes
    - efeito sonoro?



  - DATA
    - opção apagar todos os dados

    - IMPUT
      DONE- erro ao ficar apertado e arrasta para o próximo botão
        - ABOUT - adicionando mouseout, para encerrar o setInterval

    - export
        DONE- criar checkbox mais personalizável

    - import
      DONE- checar se é um objeto no modelo aceito (se tem um balls:[] e um cards:[])
      DONE- conferir se o cada card tem 24 numeros e se são válidos para a posição
      DONE- exibir mensagem 'modelo não compatível'
        ABOUT foram adicionadas várias mensagens de erro
      DONE- ? tirar botão preview e colocar oninput?
      DONE- destacar no preview apenas bolas e cards ainda não existentes
      DONE- liberar botões adicionar somente quando há bolas ou cards destacadas
      DONE- adicionar processo de confimação para os métodos add e replace
      - escolher quais cartelas quer adicionar, default é todas ****************************

  - PERSONALIZAÇÃO
    DONE- cor primária
    - cor font sobre cor primaria
    DONE- colocar o botão add da cor do marcador de novos items
    DONE- tema escuro e claro
    DONE- cores dos numeros sorteados
    - mensagem "As configurações de personalização não estão disponíveis nesse dispositivo."
    - escolher tamanho das bolas sorteadas (acessibilidade)
    - escolher tamanho dos cards
      - entre alguns layouts

  - ANIMAÇÕES
    - quando fechar uma cartela, rolar a página até lá e mudar de cor

  - AREA DE NOTIFICAÇÕES
    DONE- cada notificação tem um tempo de exibição personalizado
    - notificar quando uma cartela estiver por 3, 2 e 1
    ? fazer histórico das notificações? um botão no canto inferior direito?
    ? sempre que sair todas as pedras de uma letra
    DONE- sempre que cancelar a edição de um cards
      - se não mudou nada não mostra
      - se sim, mensagem = "you sure to delete? todo o rasunho será perdido !"
    DONE- sem pointerEvents


IDEAS
  ? modo marcar manualmente?
    - fica apertado para marcar/desmarcar
  - conseguir mover cards
  DONE- dividir os numberos de acordo com suas letras?
    - é bom porque sabe quantas vai estar faltando em cada letra
  ? colocar numeros nas cartelas para idenficar melhor no html?
  - ser possivel fazer scroll no ballsStoric em qualquer lugar dele (para desktop)


NOTES:
  NOTIFICAÇÃO 
    MODELO : new Notification("hello worl", 5000, {html: "UNDO", function: () => {console.log('HEYY')}})
    SPAN : `<span class="spanNoti">` - letra mais opaca


WARN
  - controlThingsOfInput é executado 3 vezes quando inputBall == 1 || == 75



POSSIBLE UPDATES
  - agora a cor primária atual é especificada na sua escolha
    - com o sinal de ok, no select e no hide
  - novo tema adicionado: NEON RBG
  - indicar o que cada cor significa nos cartões
    - ultimo a sair na cartela, penultimo e outros
  - se no formato mobile, mostrar a imagem do tema no formato mobile
  - PEDRAS SORTEADAS
    - agora é possivel escolher apenas uma cor para as pedras sorteadas nas cartelas
      - não será mais: red=last | yellow=next-to-last | green=others
    - indica se nova cores escolhidas já são novas
      - individutalmente, com um icone de new no canto (com pointerEvents = none)
    - mostra tittle sobre as pedras
      - pra indicar se é a ultima pedra a sair, ou penultima (na cartela)
    - agora é possivel escolher cor da letra das pedras
      - para combinar com todas as suas cores personalizadas :)
  - agora não é mostrado as frases sendo traduzidas para o português
    - como por exemplo os erros no cardInput
  - agora um novo card só é adicionado ao layout depois de salvo pela primeira vez
    - isso otimiza a performace e evita animações desnecessárias

<div class="settingOpt">
  <label for="">Settings Sync</label>
  <span>
    <p class="description">
      ?
      <span class="hidden">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam, eligendi. Amet culpa adipisci magni inventore, minus quam vero distinctio numquam illo a ullam asperiores minima, maxime facere quia, explicabo atque!
      </span>
    </p>
    <input type="button" value="Import">
    <input type="button" value="Export">
  </span>
</div>