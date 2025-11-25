import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  const viewports = [
    { width: 1920, height: 1080, name: 'FullHD-1920x1080' },
    { width: 1366, height: 768, name: 'HD-1366x768' },
    { width: 2560, height: 1440, name: '2K-2560x1440' },
    { width: 3840, height: 2160, name: '4K-3840x2160' }
  ];

  console.log('Testing Traditional Menu Design\n');

  for (const viewport of viewports) {
    console.log(`\n📺 Testing ${viewport.name}...`);

    const page = await context.newPage();
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('http://localhost:4321/menu-display');
    await page.waitForTimeout(2000); // Wait for rendering

    // Take screenshot
    await page.screenshot({
      path: `traditional-menu-${viewport.name}.png`,
      fullPage: false
    });

    // Analyze menu structure
    const menuInfo = await page.evaluate(() => {
      const sections = document.querySelectorAll('.menu-section');
      const items = document.querySelectorAll('.menu-item');
      const content = document.querySelector('.display-content');

      const viewportHeight = window.innerHeight;
      const contentScrollHeight = content.scrollHeight;
      const contentClientHeight = content.clientHeight;

      return {
        totalSections: sections.length,
        totalItems: items.length,
        sectionNames: Array.from(sections).map(s => s.querySelector('.section-header')?.textContent),
        hasScroll: contentScrollHeight > contentClientHeight,
        viewportHeight,
        contentScrollHeight,
        contentClientHeight,
        itemsPerSection: Array.from(sections).map(s => ({
          name: s.querySelector('.section-header')?.textContent,
          itemCount: s.querySelectorAll('.menu-item').length
        }))
      };
    });

    console.log(`   Total Sections: ${menuInfo.totalSections}`);
    console.log(`   Total Items: ${menuInfo.totalItems}`);
    console.log(`   Sections: ${menuInfo.sectionNames.join(', ')}`);
    console.log(`   Has Scroll: ${menuInfo.hasScroll ? '⚠️  YES' : '✅ NO'}`);
    console.log(`   Content Height: ${menuInfo.contentScrollHeight}px / ${menuInfo.contentClientHeight}px`);

    if (menuInfo.itemsPerSection.length > 0) {
      console.log(`   Items per Section:`);
      menuInfo.itemsPerSection.forEach(section => {
        console.log(`      ${section.name}: ${section.itemCount} items`);
      });
    }

    await page.close();
  }

  await browser.close();
  console.log('\n✅ Testing complete! Check screenshots for visual verification.');
})();
