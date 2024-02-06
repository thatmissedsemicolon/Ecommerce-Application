import os
import uuid
from PIL import Image
import io
from werkzeug.utils import secure_filename

class ImageManager:
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    MAX_FILE_SIZE = 500 * 1024

    def __init__(self, upload_folder):
        self.upload_folder = upload_folder

    @staticmethod
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ImageManager.ALLOWED_EXTENSIONS

    @staticmethod
    def is_valid_image(file_stream):
        file_stream_copy = io.BytesIO(file_stream.read())
        file_stream.seek(0)

        file_stream_copy.seek(0, os.SEEK_END)
        file_size = file_stream_copy.tell()
        file_stream_copy.seek(0)

        if file_size > ImageManager.MAX_FILE_SIZE:
            return False, 'File size exceeds 500 KB limit!'

        try:
            with Image.open(file_stream_copy) as img:
                img.verify()
                return True, 'Valid image!'
        except (IOError, SyntaxError):
            return False, 'Invalid image file!'

    def save_image(self, file, filename):
        if file and self.allowed_file(filename):
            valid, message = self.is_valid_image(file.stream)
            if not valid:
                return False, message, None

            filename = secure_filename(filename)

            unique_id = str(uuid.uuid4())

            name, ext = os.path.splitext(filename)

            if not ext or not name:
                return False, 'Invalid file name!', None
            
            unique_filename = f"{name}_{unique_id}{ext}"
            filename = secure_filename(unique_filename)
            file_path = os.path.join(self.upload_folder, unique_filename)
            file.save(file_path)
            return True, 'File uploaded successfully!', file_path
        return False, 'Invalid file extension!', None
