<template>
  <div class="page">
    <!-- HEADER -->
    <header class="header">
      <div class="container header__content">
        <div class="logo">🏆 <span>VirtualBasket</span></div>

        <button class="btn btn--outline">Зарегистрироваться</button>
      </div>
    </header>

    <!-- HERO -->
    <section class="hero">
      <div class="container hero__content">
        <h1>
          Создай свою виртуальную<br />
          баскетбольную команду!
        </h1>

        <p>Анализируй статистику, формируй состав и побеждай!</p>

        <button class="btn">Начать игру</button>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="about">
      <div class="container">
        <h2>О проекте</h2>

        <p class="about__text">
          VirtualBasket — это инновационная система управления виртуальными
          баскетбольными командами. Анализируйте статистику игроков, формируйте
          оптимальный состав и следите за достижениями вашей команды.
        </p>

        <div class="about__cards">
          <div class="card">
            <div class="card__icon">📊</div>
            <h3>Анализ статистики игроков</h3>
            <p>
              Подробная статистика по каждому игроку: очки, подборы, передачи и
              многое другое
            </p>
          </div>

          <div class="card">
            <div class="card__icon">👥</div>
            <h3>Управление составом</h3>
            <p>
              Создавайте и редактируйте составы команд из лучших игроков NBA,
              Евролиги и ВТБ
            </p>
          </div>

          <div class="card">
            <div class="card__icon">⚙️</div>
            <h3>Поддержка и обновления</h3>
            <p>Регулярное обновление статистики и добавление новых игроков</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="features">
      <div class="container">
        <h2>Возможности</h2>
        <p class="subtitle">
          Всё необходимое для управления виртуальной командой
        </p>

        <div class="features__grid">
          <div class="feature-card">
            <div class="feature-card__icon">👤</div>
            <h3>Управление игроками</h3>
            <p>Добавляйте, редактируйте и удаляйте игроков из вашей команды</p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon">📈</div>
            <h3>Рейтинг пользователей</h3>
            <p>Соревнуйтесь с другими игроками в рейтинговой таблице</p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon">🎯</div>
            <h3>Система монет</h3>
            <p>
              Покупайте игроков за виртуальные монеты и стройте команду мечты
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon">🏅</div>
            <h3>Достижения</h3>
            <p>Занимайте топ позиции и получайте награды за свои команды</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2>Готовы начать?</h2>
      <p>Создайте свою команду мечты уже сегодня</p>

      <button class="btn">Войти в систему</button>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="container footer__content">
        <div>
          <h4>Контактная информация</h4>
          <p>📧 info@virtualbasket.ru</p>
        </div>

        <div>
          <h4>Ресурсы</h4>
          <p>📦 GitHub</p>
          <p>📘 Документация</p>
        </div>

        <div>
          <h4>О проекте</h4>
          <p>
            VirtualBasket — система управления виртуальными баскетбольными
            командами
          </p>
          <p class="copyright">© 2025 VirtualBasket</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ОСНОВНЫЕ НАСТРОЙКИ */
.page {
  font-family: "Segoe UI", sans-serif;
  color: #ffffff;
  background: #f5f6fa;
}

h1,
h2 {
  font-weight: 700;
}

.container {
  width: 100%;
  max-width: 1150px;
  margin: 0 auto;
  padding: 0 20px;
}

/* HEADER */
.header {
  background: #1c3b8b;
  padding: 15px 0;
}

.header__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 600;
}

/* HERO */
.hero {
  background: linear-gradient(180deg, #1c3b8b 0%, #586cb3 100%);
  padding: 120px 20px;
  text-align: center;
}

.hero h1 {
  font-size: 40px;
  margin-bottom: 20px;
}

.hero p {
  font-size: 18px;
  margin-bottom: 30px;
}

/* ABOUT */
.about {
  padding: 80px 0;
  color: #1c3b8b;
  background: white;
  text-align: center;
}

.about__text {
  max-width: 800px;
  margin: 0 auto 50px;
  line-height: 1.6;
}

.about__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.card {
  background: #fff;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.card__icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 15px;
  font-size: 24px;
}

/* FEATURES */
.features {
  padding: 80px 0;
  background: #f2f2f2;
  color: #1c3b8b;
  text-align: center;
}

.subtitle {
  margin: 10px 0 40px;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.feature-card {
  background: #fff;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.feature-card__icon {
  font-size: 28px;
  margin-bottom: 15px;
}

/* CTA */
.cta {
  background: #1c3b8b;
  padding: 80px 20px;
  text-align: center;
}

/* FOOTER */
.footer {
  background: #162f73;
  padding: 40px 0;
}

.footer__content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.footer h4 {
  margin-bottom: 10px;
}

.copyright {
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.7;
}

/* BUTTON */
.btn {
  background: #ff7b00;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn--outline {
  background: #ff7b00;
  padding: 10px 20px;
}
</style>

<script>
export default {
  name: "Home",
};
</script>
