#!/usr/bin/env python3
import os
import glob
from PIL import Image

def optimize_images():
    public_dir = os.path.abspath("public")
    project_dir = os.path.abspath(".")
    
    # Extensions to convert
    convert_exts = ('.png', '.jpg', '.jpeg')
    
    # Exclude files if needed (e.g., icons that must be exact PNG names for external manifests)
    exclude_files = set()
    
    # Find image files
    all_files = glob.glob(os.path.join(public_dir, "**/*.*"), recursive=True)
    images_to_convert = []
    
    for filepath in all_files:
        ext = os.path.splitext(filepath)[1].lower()
        rel_path = os.path.relpath(filepath, public_dir)
        if ext in convert_exts and rel_path not in exclude_files:
            images_to_convert.append(filepath)
            
    if not images_to_convert:
        print("✨ No unoptimized images found in public/ directory.")
        return
        
    print(f"🖼️ Found {len(images_to_convert)} image(s) to optimize into WebP format...\n")
    
    replacements = {}
    saved_bytes = 0
    
    for filepath in images_to_convert:
        filename = os.path.basename(filepath)
        base_name, old_ext = os.path.splitext(filepath)
        webp_filepath = f"{base_name}.webp"
        
        rel_old = "/" + os.path.relpath(filepath, public_dir).replace("\\", "/")
        rel_new = "/" + os.path.relpath(webp_filepath, public_dir).replace("\\", "/")
        
        orig_size = os.path.getsize(filepath)
        
        try:
            with Image.open(filepath) as img:
                # Convert RGBA/P to RGB for WebP if needed, or keep alpha channel
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img.save(webp_filepath, 'WEBP', quality=82, optimize=True)
                else:
                    img.convert('RGB').save(webp_filepath, 'WEBP', quality=82, optimize=True)
                    
            new_size = os.path.getsize(webp_filepath)
            diff = orig_size - new_size
            saved_bytes += max(0, diff)
            
            print(f"  ✅ Converted: {rel_old} ({orig_size/1024:.1f} KB) → {rel_new} ({new_size/1024:.1f} KB) [-{(diff/orig_size)*100:.1f}%]")
            
            # Remove original file to eliminate clutter
            os.remove(filepath)
            
            # Store replacement mapping for code updating
            replacements[rel_old] = rel_new
            # Also store without leading slash if used in code
            replacements[rel_old.lstrip('/')] = rel_new.lstrip('/')
            
        except Exception as e:
            print(f"  ❌ Error converting {filepath}: {e}")
            
    print(f"\n🎉 Total disk space saved: {saved_bytes / 1024 / 1024:.2f} MB")
    
    # Update code and content references across project
    if replacements:
        print("\n🔍 Updating code & content references...")
        scan_dirs = ["app", "components", "content", "lib", "public", "utils"]
        files_updated = 0
        
        for sdir in scan_dirs:
            full_scan_path = os.path.join(project_dir, sdir)
            if not os.path.exists(full_scan_path):
                continue
                
            for root, _, files in os.walk(full_scan_path):
                for file in files:
                    if file.endswith(('.tsx', '.ts', '.jsx', '.js', '.json', '.mdx', '.md', '.css', '.html')):
                        file_path = os.path.join(root, file)
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            
                        new_content = content
                        for old_ref, new_ref in replacements.items():
                            if old_ref in new_content:
                                new_content = new_content.replace(old_ref, new_ref)
                                
                        if new_content != content:
                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            rel_code_path = os.path.relpath(file_path, project_dir)
                            print(f"  ✏️ Updated references in: {rel_code_path}")
                            files_updated += 1

        print(f"\n✨ Optimization complete! Updated {files_updated} file(s). Raw source files removed.")

if __name__ == "__main__":
    optimize_images()
