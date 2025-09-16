import {Share} from "@capacitor/share";

export async function share() {
  const result = await Share.canShare()
  console.log('result', result)
  const shareData = {
    title: 'Test share',
    text: 'Test native share function',
    url: 'https://capgo.app/blog/building-a-native-mobile-app-with-nextjs-and-capacitor/#using-capacitor-plugins',
  }
  if(result.value) {
    await Share.share({
      ...shareData,
      dialogTitle: 'Share with friends',
    });
  } else {
    if (navigator.share) {
      await navigator.share(shareData)
    }
  }
}