import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface AuthenticationMagicLinkTemplateProps {
  userEmail: string
  authLink: string
}

export function AuthenticationMagicLinkTemplate({
  userEmail,
  authLink,
}: AuthenticationMagicLinkTemplateProps) {
  const previewText = `Faça login no Dashboard Wizard`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px] text-center">
              <span className="text-2xl">🧙‍♂️</span>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Faça login no Dashboard Wizard
            </Heading>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              Você solicitou um link para login no Dashboard Wizard através do
              email
              <br />
              {userEmail}
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-sky-500 rounded text-white px-5 py-3 text-[12px] font-semibold no-underline text-center"
                href={authLink}
              >
                Entrar agora
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              ou copie a URL abaixo e cole em seu browser
              <br />
              <Link
                href={authLink}
                className="text-sky-500 no-underline text-center"
              >
                {authLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Se você não solicitou esse link de autenticação, apenas descarte
              esse e-mail.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
