
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from IndicTransToolkit.processor import IndicProcessor
from deep_translator import GoogleTranslator
import logging

class BridgeTranslator:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.use_fallback = False
        self.model_name = "ai4bharat/indictrans2-en-indic-dist-200M"
        
        try:
            print(f"Loading AI4Bharat model on {self.device}...")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, trust_remote_code=True)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name, trust_remote_code=True)
            self.model = self.model.to(self.device)
            self.ip = IndicProcessor(inference=True)
            print("AI4Bharat model loaded successfully.")
        except Exception as e:
            print(f"Warning: Failed to load AI4Bharat model. Switching to fallback mode. Error: {e}")
            self.use_fallback = True
            
    def translate_to_english(self, text, source_lang='auto'):
        """
        Translates text to English using fallback mechanism (Deep Translator).
        Since IndicTrans2 is En-Indic, we use GoogleTranslator for Indic-En direction 
        or if we want to support robust input handling.
        """
        try:
            return GoogleTranslator(source=source_lang, target='en').translate(text)
        except Exception as e:
            print(f"Error in translate_to_english: {e}")
            return text

    def _get_indic_code(self, lang_code):
        mapping = {
            'hi': 'hin_Deva',
            'mr': 'mar_Deva',
            'bn': 'ben_Beng',
            'ta': 'tam_Taml',
            'te': 'tel_Telu',
            'kn': 'kan_Knda',
            'ml': 'mal_Mlym'
        }
        return mapping.get(lang_code, 'hin_Deva')

    def translate_text(self, text, target_lang):
        """
        Translates English text to Target Indic Language.
        """
        if not text or not isinstance(text, str):
            return text
            
        if self.use_fallback:
            try:
                return GoogleTranslator(source='auto', target=target_lang).translate(text)
            except:
                return text

        try:
            # AI4Bharat Inference
            src_lang = "eng_Latn"
            tgt_lang = self._get_indic_code(target_lang)
            
            batch = self.ip.preprocess_batch([text], src_lang=src_lang, tgt_lang=tgt_lang)
            inputs = self.tokenizer(batch, return_tensors="pt", padding=True, truncation=True, max_length=512).to(self.device)
            
            with torch.no_grad():
                generated_tokens = self.model.generate(
                    **inputs,
                    use_cache=True,
                    min_length=0,
                    max_length=512,
                    num_beams=5,
                    num_return_sequences=1,
                )
                
            with self.tokenizer.as_target_tokenizer():
                generated_tokens = self.tokenizer.batch_decode(
                    generated_tokens.detach().cpu().tolist(),
                    skip_special_tokens=True,
                    clean_up_tokenization_spaces=True,
                )
            
            results = self.ip.postprocess_batch(generated_tokens, lang=tgt_lang)
            return results[0]
            
        except Exception as e:
            print(f"AI4Bharat Inference Failed: {e}. Using Fallback.")
            # Fallback
            try:
                return GoogleTranslator(source='auto', target=target_lang).translate(text)
            except:
                return text

    def translate_ui_content(self, json_data, target_lang):
        """
        Translates the Final Argument Map JSON (Thesis, Nodes) into the user's target language.
        """
        if target_lang == 'en':
            return json_data
            
        print(f"Translating UI Content to {target_lang}...")
        
        # Deep copy to avoid mutating original if needed (though we return modified)
        translated_data = json_data.copy()
        
        # Translate Thesis/Root
        if 'blueprint' in translated_data:
            for node in translated_data['blueprint']:
                if 'content' in node:
                    node['content'] = self.translate_text(node['content'], target_lang)
                if 'logicalRole' in node:
                    node['logicalRole'] = self.translate_text(node['logicalRole'], target_lang)
                    
        # Translate Summary
        if 'summary' in translated_data:
            translated_data['summary'] = self.translate_text(translated_data['summary'], target_lang)
            
        # Translate Analysis
        if 'analysis' in translated_data:
            translated_data['analysis'] = self.translate_text(translated_data['analysis'], target_lang)
            
        # Translate Key Points
        if 'keyPoints' in translated_data and isinstance(translated_data['keyPoints'], list):
             translated_data['keyPoints'] = [self.translate_text(kp, target_lang) for kp in translated_data['keyPoints']]
             
        # Translate Brutal Honest Take
        if 'brutalHonestTake' in translated_data:
            translated_data['brutalHonestTake'] = self.translate_text(translated_data['brutalHonestTake'], target_lang)
            
        return translated_data
